import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QuestionScreen from './components/questions';

const QuestionContainer = ({ route, navigation }) => {
  const { questions, currentIndex } = route.params;
  const question = questions[currentIndex];
  const isMultiple = question.type === 'multiple-answer';

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const handleChoicePress = (index) => {
    if (isMultiple) {
      setSelectedIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedIndex(index);
    }
  };

  const handleNext = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].selectedAnswer = isMultiple
      ? selectedIndexes
      : selectedIndex;

    if (currentIndex < questions.length - 1) {
      navigation.navigate('Question', {
        questions: updatedQuestions,
        currentIndex: currentIndex + 1,
      });
    } else {
      navigation.navigate('Summary', { questions: updatedQuestions });
    }
  };

  const handlePrev = () => {
    navigation.navigate('Question', {
      questions,
      currentIndex: currentIndex - 1,
    });
  };

  return (
    <View style={styles.container}>
      <QuestionScreen
        question={question}
        isMultiple={isMultiple}
        selectedIndex={selectedIndex}
        selectedIndexes={selectedIndexes}
        onSelect={handleChoicePress}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          title={currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
          onPress={handleNext}
          disabled={
            isMultiple ? selectedIndexes.length === 0 : selectedIndex === null
          }
        />
      </View>
    </View>
  );
};

const Summary = ({ route, navigation }) => {
  const { questions } = route.params;
  const [score, setScore] = useState(0);

  useEffect(() => {
    let total = 0;
    questions.forEach((q) => {
      const selected = q.selectedAnswer;
      const correct = q.correct;

      const isCorrect = Array.isArray(correct)
        ? Array.isArray(selected) &&
          correct.length === selected.length &&
          correct.every((i) => selected.includes(i))
        : selected === correct;

      if (isCorrect) total++;
    });
    setScore(total);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.score}>
        You got {score} out of {questions.length} correct!
      </Text>
      {questions.map((q, idx) => (
        <View key={idx} style={{ marginBottom: 20 }}>
          <Text style={styles.question}>{q.prompt}</Text>
          <View style={styles.choicesContainer}>
            {q.choices.map((choice, i) => {
              const isCorrect = Array.isArray(q.correct)
                ? q.correct.includes(i)
                : i === q.correct;
              const isSelected = Array.isArray(q.selectedAnswer)
                ? q.selectedAnswer.includes(i)
                : q.selectedAnswer === i;

              return (
                <Text
                  key={i}
                  style={[
                    styles.choice,
                    isCorrect && styles.correct,
                    isSelected && styles.selected,
                    !isCorrect && isSelected && styles.incorrect,
                  ]}
                >
                  {choice}
                </Text>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const Stack = createStackNavigator();

export default function App() {
  const questions = [
    {
      prompt: 'What is the capital of France?',
      type: 'multiple-choice',
      choices: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      correct: 2,
    },
    {
      prompt: 'Which of these are fruits?',
      type: 'multiple-answer',
      choices: ['Carrot', 'Apple', 'Banana', 'Cucumber'],
      correct: [1, 2],
    },
    {
      prompt: 'Is 5 greater than 3?',
      type: 'true-false',
      choices: ['True', 'False'],
      correct: 0,
    },
  ];

  const questionsWithAnswers = questions.map((q) => ({
    ...q,
    selectedAnswer: null,
  }));

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Question"
          component={QuestionContainer}
          initialParams={{ questions: questionsWithAnswers, currentIndex: 0 }}
        />
        <Stack.Screen
          name="Summary"
          component={Summary}
          options={{
            headerLeft: null, 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  question: {
    fontSize: 20,
    marginBottom: 10,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  choicesContainer: {
    marginVertical: 10,
  },
  choice: {
    fontSize: 16,
    marginVertical: 4,
  },
  correct: {
    color: 'green',
    fontWeight: 'bold',
  },
  incorrect: {
    color: 'red',
    textDecorationLine: 'line-through',
  },
  selected: {
    fontWeight: 'bold',
  },
});
