import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useInterview } from '../contexts/InterviewContext';

export const FeedbackScreen = ({ navigation }: any) => {
  const { state, resetInterview } = useInterview();

  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Geri bildirim oluşturuluyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!state.feedback || (!state.selectedProfession && !state.customProfession) || 
      (!state.selectedPosition && !state.customPosition)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: Henüz geri bildirim oluşturulmamış.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('ProfessionSelection')}
          >
            <Text style={styles.backButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Meslek ve pozisyon bilgisini hem normal seçim hem de özel eklemeler için ele al
  const professionTitle = state.selectedProfession 
    ? state.selectedProfession.title 
    : state.customProfession;
  
  const positionTitle = state.selectedPosition 
    ? state.selectedPosition.title 
    : state.customPosition;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mülakat Geri Bildirimi</Text>
        <Text style={styles.subtitle}>
          {professionTitle} - {positionTitle}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Genel Puan</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{state.feedback.overallScore}</Text>
            <Text style={styles.scoreMaxText}>/10</Text>
          </View>
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>Güçlü Yanlar</Text>
          {state.feedback.strengths.length > 0 ? (
            state.feedback.strengths.map((strength, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.strengthBullet}>•</Text>
                <Text style={styles.feedbackText}>{strength}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemText}>Güçlü yan bulunamadı.</Text>
          )}
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>Geliştirilebilecek Alanlar</Text>
          {state.feedback.weaknesses.length > 0 ? (
            state.feedback.weaknesses.map((weakness, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.weaknessBullet}>•</Text>
                <Text style={styles.feedbackText}>{weakness}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemText}>Geliştirilebilecek alan bulunamadı.</Text>
          )}
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>Genel Değerlendirme</Text>
          <Text style={styles.overallText}>{state.feedback.overallFeedback}</Text>
        </View>

        <View style={styles.questionAnswersSection}>
          <Text style={styles.sectionTitle}>Sorular ve Cevaplarınız</Text>
          {state.questions.map((question, index) => (
            <View key={index} style={styles.qaContainer}>
              <View style={styles.questionContainer}>
                <Text style={styles.questionNumber}>Soru {index + 1}</Text>
                <Text style={styles.questionText}>{question.question}</Text>
              </View>
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>Cevabınız:</Text>
                <Text style={styles.answerText}>{state.answers[index]}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            resetInterview();
            navigation.navigate('ProfessionSelection');
          }}
        >
          <Text style={styles.buttonText}>Yeni Mülakat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreMaxText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
  },
  feedbackSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  strengthBullet: {
    fontSize: 18,
    color: '#28a745',
    marginRight: 10,
  },
  weaknessBullet: {
    fontSize: 18,
    color: '#dc3545',
    marginRight: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#212529',
    flex: 1,
  },
  noItemText: {
    fontSize: 16,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  overallText: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#007bff',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionAnswersSection: {
    marginTop: 10,
  },
  qaContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: '#212529',
  },
}); 