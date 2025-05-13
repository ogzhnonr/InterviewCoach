import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useInterview } from '../contexts/InterviewContext';
import { professions } from '../data/professions';

export const ProfessionSelectionScreen = ({ navigation }: any) => {
  const { setProfession, setPosition, state, generateInterviewQuestions } = useInterview();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mülakat Koçu</Text>
        <Text style={styles.subtitle}>Meslek ve pozisyon seçiniz</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Meslek Grubu</Text>
          <ScrollView style={styles.listContainer}>
            {professions.map((profession) => (
              <TouchableOpacity
                key={profession.id}
                style={[
                  styles.itemButton,
                  state.selectedProfession?.id === profession.id && styles.selectedItem,
                ]}
                onPress={() => setProfession(profession)}
              >
                <Text style={styles.itemText}>{profession.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {state.selectedProfession && (
          <View style={styles.selectionContainer}>
            <Text style={styles.sectionTitle}>Pozisyon</Text>
            <ScrollView style={styles.listContainer}>
              {state.selectedProfession.positions.map((position) => (
                <TouchableOpacity
                  key={position.id}
                  style={[
                    styles.itemButton,
                    state.selectedPosition?.id === position.id && styles.selectedItem,
                  ]}
                  onPress={() => setPosition(position)}
                >
                  <Text style={styles.itemText}>{position.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!state.selectedProfession || !state.selectedPosition) && styles.disabledButton,
          ]}
          disabled={!state.selectedProfession || !state.selectedPosition}
          onPress={() => {
            generateInterviewQuestions();
            navigation.navigate('Questions');
          }}
        >
          <Text style={styles.continueButtonText}>Mülakata Başla</Text>
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
  selectionContainer: {
    marginBottom: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  listContainer: {
    flex: 1,
  },
  itemButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#e2f2ff',
    borderColor: '#007bff',
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#212529',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
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
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 