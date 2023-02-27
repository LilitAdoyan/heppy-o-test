/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import PhoneInput from 'react-native-phone-number-input';

import React, {useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserName, setShowUserName] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [SMS, setSMS] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let createUser = (phone: string) => {
    console.log(phone);
    const callingCode = phoneInput?.current?.getCallingCode();
    console.log(callingCode);
    fetch('https://dev.happyo.app/api/v4/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({phone: '+' + callingCode + phone}),
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        if (!result.result.is_exist) {
          setShowUserName(true);
        }
      })
      .catch(error => {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
        throw error;
      });
  };

  let signIn = () => {
    fetch('https://dev.happyo.app/api/v4/auth/signin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        console.log(res, 'hi');
        return res.json();
      })
      .then(result => {
        console.log(result, 'bye');
      })
      .catch(error => {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
        // ADD THIS THROW error
        throw error;
      });
  };

  return (
    <View style={styles.inner}>
      <View style={styles.innermost}>
        {!SMS ? (
          <>
            <Text>Вход</Text>
            <Text>Телефон</Text>
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="DM"
              layout="first"
              onChangeText={text => {
                setValue(text);
                createUser(value);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
              }}
              onChangeCountry={country => console.log(country)}
              withDarkTheme
              withShadow
              autoFocus
            />
            {showUserName && (
              <TextInput
                maxLength={40}
                onChangeText={text => setUserName(text)}
                value={userName}
                style={styles.input}
                editable
              />
            )}
          </>
        ) : (
          <>
            <Text>Введите СМС</Text>
            <View style={styles.codeWrapper}>
              <TextInput
                maxLength={1}
                onChangeText={text => setUserName(text)}
                value={'1'}
                style={styles.smsStyle}
              />
              <TextInput
                maxLength={1}
                onChangeText={text => setUserName(text)}
                value={'2'}
                style={styles.smsStyle}
              />
              <TextInput
                maxLength={1}
                onChangeText={text => setUserName(text)}
                value={'3'}
                style={styles.smsStyle}
              />
              <TextInput
                maxLength={1}
                onChangeText={text => setUserName(text)}
                value={'4'}
                style={styles.smsStyle}
              />
              <TextInput
                maxLength={1}
                onChangeText={text => setUserName(text)}
                value={'5'}
                style={styles.smsStyle}
              />
              <TextInput
                maxLength={1}
                onChangeText={text => setUserName(text)}
                value={'6'}
                style={styles.smsStyle}
              />
            </View>
          </>
        )}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Button
          title="Отправить"
          onPress={() => {
            signIn();
            setSMS(true);
          }}
          disabled={showUserName ? false : true}
        />
      </KeyboardAvoidingView>
      {/* <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
  },
  innermost: {
    flex: 1,
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  smsStyle: {
    width: 40,
    borderWidth: 1,
    padding: 5,
  },
});

export default App;
