import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MyGraphEditor } from './components/GraphEditor'
import { GetNameDialog } from './components/GetNameDialog'
import {  useLayout } from 'colay-ui'
import {  useImmer } from 'colay-ui/hooks/useImmer'
import { useAuth } from './api/firebase'

export default function App() {
  const {
    width,
    height,
    onLayout,
  } = useLayout()
  const [state, updateState] = useImmer({
    isLoading: true,
    name: ''
  })
  const authResult = useAuth()
  console.log('Auth result', authResult)
  return (
    <View
      style={styles.container}
      onLayout={onLayout}
    >
     {
       authResult.isLoading
       ? (
         <ActivityIndicator />
       )
       : (
          state.isLoading
          ? (
             <GetNameDialog 
               onSubmit={(name) => {
                 updateState((draft)=> {
                   draft.isLoading = false
                   draft.name = name
                 })
               }}
             />
          )
          : (
           <MyGraphEditor
             {...{
               width,
               height,
             }}
             userName={state.name}
           />
          )
       )
     }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
