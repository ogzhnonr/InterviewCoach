import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useInterview } from '../contexts/InterviewContext';
import { professions } from '../data/professions';
import { CustomTextField } from '../components/CustomTextField';

export const ProfessionSelectionScreen = ({ navigation }: any) => {
  const { 
    setProfession, 
    setPosition, 
    setCustomProfession, 
    setCustomPosition,
    state, 
    generateInterviewQuestions
  } = useInterview();

  // Dropdown state
  const [openProfession, setOpenProfession] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);
  
  // Custom input fields
  const [newProfessionName, setNewProfessionName] = useState("");
  const [newPositionName, setNewPositionName] = useState("");
  const [customProfessionError, setCustomProfessionError] = useState<string | null>(null);
  const [customPositionError, setCustomPositionError] = useState<string | null>(null);

  // Dropdown için meslek listesini hazırlama
  const professionItems = professions.map(profession => ({
    label: profession.title,
    value: profession.id
  }));

  // Seçilen meslek grubuna göre pozisyon listesini hazırlama
  const positionItems = state.selectedProfession ? 
    state.selectedProfession.positions.map(position => ({
      label: position.title,
      value: position.id
    })) : [];

  // Dropdown seçimleri
  const handleProfessionChange = useCallback((value: string | null) => {
    if (value) {
      const selectedProf = professions.find(p => p.id === value);
      if (selectedProf) {
        setProfession(selectedProf);
      }
    } else {
      setProfession(null);
    }
  }, [setProfession]);

  const handlePositionChange = useCallback((value: string | null) => {
    if (value && state.selectedProfession) {
      const selectedPos = state.selectedProfession.positions.find(p => p.id === value);
      if (selectedPos) {
        setPosition(selectedPos);
      }
    } else {
      setPosition(null);
    }
  }, [setPosition, state.selectedProfession]);

  // Özel meslek grubu ekleme
  const handleAddCustomProfession = () => {
    const trimmedValue = newProfessionName.trim();
    if (!trimmedValue) {
      setCustomProfessionError("Meslek grubu adı boş olamaz");
      return;
    }

    // Meslek grubu zaten var mı kontrol et
    const exists = professions.some(p => 
      p.title.toLowerCase() === trimmedValue.toLowerCase()
    );
    
    if (exists) {
      setCustomProfessionError("Bu meslek grubu zaten listede bulunuyor");
      return;
    }

    setCustomProfession(trimmedValue);
    setCustomProfessionError(null);
    setNewProfessionName("");
  };

  // Özel pozisyon ekleme
  const handleAddCustomPosition = () => {
    const trimmedValue = newPositionName.trim();
    if (!trimmedValue) {
      setCustomPositionError("Pozisyon adı boş olamaz");
      return;
    }

    // Pozisyon zaten var mı kontrol et
    if (state.selectedProfession) {
      const exists = state.selectedProfession.positions.some(p => 
        p.title.toLowerCase() === trimmedValue.toLowerCase()
      );
      
      if (exists) {
        setCustomPositionError("Bu pozisyon zaten listede bulunuyor");
        return;
      }
    }

    setCustomPosition(trimmedValue);
    setCustomPositionError(null);
    setNewPositionName("");
  };

  // Mülakat başlatma
  const handleStartInterview = () => {
    if ((!state.selectedProfession && !state.customProfession) || 
        (!state.selectedPosition && !state.customPosition)) {
      Alert.alert("Uyarı", "Lütfen hem meslek grubu hem de pozisyon seçiniz");
      return;
    }

    generateInterviewQuestions();
    navigation.navigate('Questions');
  };

  // Dropdown'lar için z-index yönetimi
  const getZIndex = (isOpen: boolean, baseZIndex: number) => {
    return isOpen ? baseZIndex : 0;
  };

  // Meslek grubu ve pozisyonun durumunu kontrol et
  const isProfessionDropdownDisabled = !!state.customProfession;
  const isPositionDropdownDisabled = !!state.customPosition;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mülakat Koçu</Text>
        <Text style={styles.subtitle}>Meslek ve pozisyon seçiniz</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Meslek Grubu Dropdown */}
        <View style={[styles.dropdownContainer, { zIndex: getZIndex(openProfession, 3000) }]}>
          <Text style={styles.sectionTitle}>Meslek Grubu</Text>
          <DropDownPicker
            open={openProfession}
            value={state.selectedProfession?.id || null}
            items={professionItems}
            setOpen={setOpenProfession}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const newValue = callback(state.selectedProfession?.id || null);
                handleProfessionChange(newValue);
              } else {
                handleProfessionChange(callback);
              }
            }}
            placeholder="Meslek grubu seçiniz"
            style={[
              styles.dropdown, 
              isProfessionDropdownDisabled ? styles.disabledDropdown : {}
            ]}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={styles.dropdownText}
            listMode="SCROLLVIEW"
            searchable
            searchPlaceholder="Ara..."
            disabled={isProfessionDropdownDisabled}
          />
          
          {/* Özel Meslek Grubu Ekleme */}
          <View style={styles.customInputContainer}>
            <Text style={styles.customInputLabel}>Meslek grubunuz listede yoksa:</Text>
            <CustomTextField
              value={newProfessionName}
              onChangeText={setNewProfessionName}
              onSubmit={handleAddCustomProfession}
              placeholder="Meslek grubu adı giriniz"
              buttonText="Ekle"
              errorText={customProfessionError}
            />
          </View>
          
          {/* Seçili özel meslek grubu gösterimi */}
          {state.customProfession && (
            <View style={styles.selectedCustomItem}>
              <Text style={styles.selectedCustomItemText}>
                Seçilen: {state.customProfession}
              </Text>
              <TouchableOpacity 
                onPress={() => setCustomProfession("")}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Pozisyon Dropdown - Meslek seçilmişse göster */}
        {(state.selectedProfession || state.customProfession) && (
          <View style={[styles.dropdownContainer, { zIndex: getZIndex(openPosition, 2000) }]}>
            <Text style={styles.sectionTitle}>Pozisyon</Text>
            
            {/* Pozisyon dropdown'ı */}
            <DropDownPicker
              open={openPosition}
              value={state.selectedPosition?.id || null}
              items={positionItems}
              setOpen={setOpenPosition}
              setValue={(callback) => {
                if (typeof callback === 'function') {
                  const newValue = callback(state.selectedPosition?.id || null);
                  handlePositionChange(newValue);
                } else {
                  handlePositionChange(callback);
                }
              }}
              placeholder="Pozisyon seçiniz"
              style={[
                styles.dropdown,
                (isPositionDropdownDisabled || !state.selectedProfession) ? styles.disabledDropdown : {}
              ]}
              dropDownContainerStyle={styles.dropdownList}
              textStyle={styles.dropdownText}
              listMode="SCROLLVIEW"
              searchable
              searchPlaceholder="Ara..."
              disabled={!state.selectedProfession || isPositionDropdownDisabled}
            />
            
            {/* Özel Pozisyon Ekleme */}
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>Pozisyonunuz listede yoksa:</Text>
              <CustomTextField
                value={newPositionName}
                onChangeText={setNewPositionName}
                onSubmit={handleAddCustomPosition}
                placeholder="Pozisyon adı giriniz"
                buttonText="Ekle"
                errorText={customPositionError}
              />
            </View>
            
            {/* Seçili özel pozisyon gösterimi */}
            {state.customPosition && (
              <View style={styles.selectedCustomItem}>
                <Text style={styles.selectedCustomItemText}>
                  Seçilen: {state.customPosition}
                </Text>
                <TouchableOpacity 
                  onPress={() => setCustomPosition("")}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            ((!state.selectedProfession && !state.customProfession) || 
             (!state.selectedPosition && !state.customPosition)) && 
            styles.disabledButton,
          ]}
          disabled={
            (!state.selectedProfession && !state.customProfession) || 
            (!state.selectedPosition && !state.customPosition)
          }
          onPress={handleStartInterview}
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
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  dropdownContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  dropdown: {
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  disabledDropdown: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.7,
  },
  dropdownList: {
    borderColor: '#ced4da',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#495057',
  },
  customInputContainer: {
    marginTop: 16,
  },
  customInputLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  selectedCustomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#e2f2ff',
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  selectedCustomItemText: {
    fontSize: 16,
    color: '#007bff',
    flex: 1,
  },
  removeButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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