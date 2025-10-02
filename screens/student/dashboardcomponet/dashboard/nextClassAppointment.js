import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity,Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { fetchStudentClasses } from "../../../../utils/api";
import { colorred, colorreddark } from "../../../../constant/color";

/* -------------------------
   Notification handler (keeps app behaviour consistent)
   ------------------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* -------------------------
   Request and setup notifications permissions & Android channel
   ------------------------- */
async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.warn("Must use physical device for notifications");
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permission not granted");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }

    return true;
  } catch (err) {
    console.error("Error registering for notifications", err);
    return false;
  }
}

/* -------------------------
   Utilities
   - parse time from item (starttime or startdate)
   - get next date for target weekday index and time
   ------------------------- */
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseTimeFromItem(item) {
  // returns { hours, minutes } or default 9:00
  // look for common fields: starttime, start_time, or time embedded in startdate string
  const defaultTime = { hours: 9, minutes: 0 };

  const timeCandidates = [
    item?.starttime,
    item?.start_time,
    item?.time,
    item?.classtime,
  ];

  for (const t of timeCandidates) {
    if (!t) continue;
    // try parse 'HH:mm' or 'HH:mm:ss' 24-hour
    const m = String(t).match(/(\d{1,2}):(\d{2})/);
    if (m) {
      const hours = parseInt(m[1], 10);
      const minutes = parseInt(m[2], 10);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) return { hours, minutes };
    }
    // try parse 'h:mm AM/PM'
    const m2 = String(t).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (m2) {
      let hours = parseInt(m2[1], 10);
      const minutes = parseInt(m2[2], 10);
      const ampm = m2[3].toUpperCase();
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    }
  }

  // If startdate includes time (e.g., "2025-09-30 14:00:00" or ISO)
  if (item?.startdate) {
    const m = String(item.startdate).match(/(\d{2}):(\d{2})/);
    if (m) {
      return { hours: parseInt(m[1], 10), minutes: parseInt(m[2], 10) };
    }
  }

  return defaultTime;
}

function getNextDateForWeekday(targetWeekdayIndex, hours = 9, minutes = 0) {
  const now = new Date();
  const todayIndex = now.getDay();
  let diff = (targetWeekdayIndex - todayIndex + 7) % 7;

  const candidate = new Date(now);
  candidate.setDate(now.getDate() + diff);
  candidate.setHours(hours, minutes, 0, 0);

  // if the candidate is today but already passed, push to next week
  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 7);
  }
  return candidate;
}

/* -------------------------
   Component
   ------------------------- */
const NextClassAppointment = () => {
  const [data, setData] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [scheduledId, setScheduledId] = useState(null);
  const nav = useNavigation();

  // Keep permission registration once on mount
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Fetch classes and compute nearest upcoming (skip endclassstudent === 1)
  const fetchData = useCallback(async () => {
    try {
      const combinedData = await fetchStudentClasses();

      const activeClasses = Array.isArray(combinedData)
        ? combinedData.filter((cls) => cls && cls.endclassstudent !== 1)
        : [];

      setData(activeClasses);
      setErrorMsg("");

      if (!activeClasses.length) {
        setNextClass(null);
        return;
      }

      // find nearest weekday across classes
      const todayIndex = new Date().getDay();
      let nearest = null;
      let nearestDiff = 8; // >7 sentinel

      activeClasses.forEach((cls) => {
        if (!cls.days) return;
        const daysArr = String(cls.days).split(/\s+/).map((d) => d.trim()).filter(Boolean);
        daysArr.forEach((dayStr) => {
          const idx = weekDays.indexOf(dayStr);
          if (idx === -1) return;
          let diff = (idx - todayIndex + 7) % 7;
          // if same day, check time: if class time already passed, we want next week (so diff=7)
          const { hours, minutes } = parseTimeFromItem(cls);
          if (diff === 0) {
            const now = new Date();
            const candidate = new Date(now);
            candidate.setHours(hours, minutes, 0, 0);
            if (candidate <= now) diff = 7;
          }
          if (diff < nearestDiff) {
            nearestDiff = diff;
            nearest = {
              ...cls,
              nextDay: dayStr,
              nextDayIndex: idx,
              daysDiff: diff,
            };
          }
        });
      });

      setNextClass(nearest ?? null);
    } catch (err) {
      console.error("fetchData error", err);
      setErrorMsg(err?.message ?? "Failed to load classes");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // whenever nextClass changes we schedule notification (cancelling previous)
  useEffect(() => {
    if (!nextClass) return;

    let mounted = true;
    (async () => {
      try {
        const hasPermissionObj = await Notifications.getPermissionsAsync();
        const hasPermission = hasPermissionObj.status === "granted";
        if (!hasPermission) {
          console.warn("No notification permission - not scheduling");
          return;
        }

        // If there was a previously scheduled notification for this widget, cancel it
        if (scheduledId) {
          try {
            await Notifications.cancelScheduledNotificationAsync(scheduledId);
          } catch (e) {
            console.warn("Failed to cancel previous scheduled notification", e);
          }
        }

        // compute next occurrence date/time for nextClass
        const { hours, minutes } = parseTimeFromItem(nextClass);
        const targetIndex = typeof nextClass.nextDayIndex === "number"
          ? nextClass.nextDayIndex
          : weekDays.indexOf(nextClass.nextDay);

        const classDate = getNextDateForWeekday(targetIndex, hours, minutes);

        // Use the new trigger format: { type: 'date', date: someDate }
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: `📚 ${nextClass.course} starts soon`,
            body: `${nextClass.course} — ${nextClass.nextDay} at ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
            sound: true,
          },
          trigger: { type: "date", date: classDate },
        });

        if (!mounted) return;
        setScheduledId(id);
        console.log("Scheduled class reminder:", id, classDate.toString());
      } catch (err) {
        console.error("Error scheduling notification:", err);
      }
    })();

    return () => { mounted = false; };
  }, [nextClass]);

  return (
    <>
      {nextClass ? (
        <View
          style={{
            margin: 16,
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{
            backgroundColor: "#DBEAFE",
            borderRadius: 12,
            padding: 12,
            marginRight: 16
          }}>
            <Text style={{ fontSize: 24 }}>📅</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colorreddark }}>
              Next Class • {nextClass.nextDay}
            </Text>
            <Text style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>
              {nextClass.course}
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              Duration: {nextClass.duration} weeks
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colorred,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
            onPress={() => nav.navigate("classDetails", { item: nextClass })}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>View</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ margin: 16 }}>
          <Text style={{ color: "#6B7280" }}>No upcoming class scheduled</Text>
        </View>
      )}
    </>
  );
};

export default NextClassAppointment;
