import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, FlatList, RefreshControl } from "react-native";
import { Divider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import { colorred } from "../../../constant/color";
import { examGetFn, examRequestFn, examActivateFn } from "../../../utils/api";

const getCardStatusMeta = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'request_exam':
      return { color: '#3B82F6', label: 'Request Exam' };
    case 'activated_exam':
      return { color: '#F59E0B', label: 'Activated' };
    case 'taken_exam':
      return { color: '#10B981', label: 'Completed' };
    default:
      return { color: '#6B7280', label: status || 'Unknown' };
  }
};

const ActionButton = ({ label, icon, color, onPress, loading }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: color,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginLeft: 8,
    }}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#FFFFFF" />
    ) : (
      <FontAwesome name={icon} size={12} color="#FFFFFF" />
    )}
    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginLeft: 6 }}>{label}</Text>
  </TouchableOpacity>
);

const ExamCard = ({ item, index, onRequestExam, onActivateExam, onViewCredentialExam,onViewResult, actionLoadingId }) => {
  const statusMeta = getCardStatusMeta(item?.status);

  const StatRow = ({ icon, label, value }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
      <FontAwesome name={icon} size={12} color="#6B7280" />
      <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>{label}: </Text>
      <Text style={{ fontSize: 14, color: '#374151', fontWeight: '600' }}>{value}</Text>
    </View>
  );

  const actionLoading = actionLoadingId === item.registrationid;

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
      }}
    >
      <View style={{ backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
              {item.course || 'No Course Name'}
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280' }}>Reg ID: #{item.registrationid || 'N/A'}</Text>
          </View>
          <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: statusMeta.color + '20' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: statusMeta.color }}>{statusMeta.label}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <View style={{ marginBottom: 8 }}>
          {/* <StatRow icon="clock-o" label="Duration" value={`${item.duration || 0} weeks`} /> */}
          {item.pass_score && <StatRow icon="percent" label="Pass Score" value={`${item.pass_score}%`} />}
          <StatRow icon="tag" label="Course Code" value={item.coursecode || 'N/A'} />
        </View>

        {String(item.status).toLowerCase() === 'taken_exam' && item.exam && (
          <View style={{ marginTop: 8, padding: 12, backgroundColor: '#ECFDF5', borderRadius: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#065F46', marginBottom: 6 }}>Result Summary</Text>
            <StatRow icon="star" label="Score" value={`${item.exam.pass_score_point || '-'}`} />
            <StatRow icon="calendar" label="Date" value={`${item.exam.finish_date || item.exam.added_date || '-'}`} />
          </View>
        )}
      </View>

      <View style={{ backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: '#6B7280' }}>Exam #{index + 1}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {String(item.status).toLowerCase() === 'request_exam' && (
            <ActionButton label="Request Exam" icon="paper-plane" color="#3B82F6" onPress={onRequestExam} loading={actionLoading} />
          )}
            {String(item.status).toLowerCase() === 'activated_exam' && (
            <ActionButton label="View Exam Credentials " icon="paper-plane" color="#3B82F6" onPress={onViewCredentialExam} loading={actionLoading} />
          )}
          {String(item.status).toLowerCase() === 'available_exam' && (
            <ActionButton label="Activate Exam" icon="bolt" color="#F59E0B" onPress={onActivateExam} loading={actionLoading} />
          )}
          {String(item.status).toLowerCase() === 'taken_exam' && (
            <ActionButton label="View Result" icon="arrow-right" color="#10B981" onPress={onViewResult} loading={false} />
          )}
        </View>
      </View>
    </View>
  );
};

const Exam = () => {
  const navigation = useNavigation();
  const { email } = useSelector((state) => state.activePage);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchExams = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await examGetFn(email);
      const list = Array.isArray(response?.data) ? response.data : [];
      setData(list);
      setErrorMsg("");
    } catch (e) {
      setErrorMsg(e?.message || "Failed to load exams");
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [email]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const onRequestExam = async (item) => {
    try {
      setActionLoadingId(item.registrationid);
      await examRequestFn(item.registrationid, item.coursecode);
      await fetchExams();
    } finally {
      setActionLoadingId(null);
    }
  };

  const onActivateExam = async (item) => {
    try {
      setActionLoadingId(item.registrationid);
      const res = await examActivateFn(item.registrationid, item.coursecode);
      const username = res?.username || res?.user || res?.data?.username;
      const password = res?.password || res?.pass || res?.data?.password;
      if (username || password) {
        Alert.alert("Exam Activated", `Username: ${username || '-'}\nPassword: ${password || '-'}`);
      } else {
        Alert.alert("Exam Activated", JSON.stringify(res, null, 2));
      }
      await fetchExams();
    } finally {
      setActionLoadingId(null);
    }
  };

  const onViewCredentialExam = async (item) => {
    try {
      setActionLoadingId(item.registrationid);
      const username = item?.registrationid
      const password = item?.studentid
        Alert.alert("Exam Activated", `Username: ${username || '-'}\nPassword: ${password || '-'}`);
      await fetchExams();
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderItem = ({ item, index }) => (
    <ExamCard
      item={item}
      index={index}
      actionLoadingId={actionLoadingId}
      onRequestExam={() => onRequestExam(item)}
      onActivateExam={() => onActivateExam(item)}
      onViewResult={() => {
      navigation.navigate('examResult', { item });
      }}
      onViewCredentialExam={() => onViewCredentialExam(item)}
    />
  );

  const keyExtractor = (item, index) => `${item.registrationid}-${index}`;

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const EmptyComponent = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
      <FontAwesome name="file-text-o" size={48} color="#D1D5DB" />
      <Text style={{ fontSize: 18, color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
        {errorMsg ? errorMsg : 'No Exams Available'}
      </Text>
      {!errorMsg && (
        <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
          Exams you are eligible for will appear here
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.andriod, styles.bgcolor, { flex: 1 }]}> 
      <Header />
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, color: colorred, fontWeight: '600' }}>
          Exams
        </Text>
        <Divider theme={{ colors: { primary: colorred } }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colorred} />
          <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading exams…</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80, flexGrow: data?.length ? 0 : 1 }}
          ListEmptyComponent={EmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchExams(true)}
              colors={[colorred]}
              tintColor={colorred}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Exam;