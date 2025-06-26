import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useInterview } from '../contexts/InterviewContext';

export const QuestionsScreen = ({ navigation }: any) => {
  const { state, setAnswer, submitAnswers } = useInterview();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNext = async () => {
    if (state.answers[currentQuestionIndex].trim() === '') {
      Alert.alert('Uyarı', 'Lütfen soruyu cevaplayınız.');
      return;
    }

    if (currentQuestionIndex < state.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Son soruyu da cevapladıysa
      Alert.alert(
        'Mülakat Tamamlandı',
        'Tüm soruları cevapladınız. Cevaplarınızı göndermek istiyor musunuz?',
        [
          {
            text: 'Hayır',
            style: 'cancel',
          },
          {
            text: 'Evet',
            onPress: async () => {
              await submitAnswers();
              navigation.navigate('Feedback');
            },
          },
        ]
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Sorular oluşturuluyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if ((!state.selectedProfession && !state.customProfession) || 
      (!state.selectedPosition && !state.customPosition) || 
      state.questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: Meslek veya pozisyon seçilmemiş.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('ProfessionSelection')}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = state.questions[currentQuestionIndex];
  
  // Meslek ve pozisyon bilgisini hem normal seçim hem de özel eklemeler için ele al
  const professionTitle = state.selectedProfession 
    ? state.selectedProfession.title 
    : state.customProfession;
  
  const positionTitle = state.selectedPosition 
    ? state.selectedPosition.title 
    : state.customPosition;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mülakat Sorusu {currentQuestionIndex + 1}/{state.questions.length}</Text>
          <Text style={styles.subtitle}>
            {professionTitle} - {positionTitle}
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Cevabınız:</Text>
            <TextInput
              style={styles.answerInput}
              multiline
              value={state.answers[currentQuestionIndex]}
              onChangeText={(text) => setAnswer(currentQuestionIndex, text)}
              placeholder="Cevabınızı buraya yazınız..."
              textAlignVertical="top"
              autoCapitalize="sentences"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
            disabled={currentQuestionIndex === 0}
            onPress={handlePrevious}
          >
            <Text style={styles.navButtonText}>Önceki</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>
              {currentQuestionIndex < state.questions.length - 1 ? 'Sonraki' : 'Tamamla'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 20,
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
  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#212529',
    lineHeight: 24,
  },
  answerContainer: {
    flex: 1,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  answerInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#212529',
    minHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
}); 