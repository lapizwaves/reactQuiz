
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

const QuestionScreen = ({
  question,
  isMultiple,
  selectedIndex,
  selectedIndexes,
  onSelect,
}) => {
  return (
    <View>
      <Text style={styles.question}>{question.prompt}</Text>
      <ButtonGroup
        buttons={question.choices}
        selectedIndex={!isMultiple ? selectedIndex : undefined}
        selectedIndexes={isMultiple ? selectedIndexes : undefined}
        onPress={onSelect}
        containerStyle={styles.buttonGroup}
        testID="choices"
        vertical
      />
    </View>
  );
};

const styles = StyleSheet.create({
  question: {
    fontSize: 20,
    marginBottom: 10,
  },
  buttonGroup: {
    marginBottom: 20,
  },
});

export default QuestionScreen;
