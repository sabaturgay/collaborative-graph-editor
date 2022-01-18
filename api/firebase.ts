import React from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore,addDoc, updateDoc, doc,
  onSnapshot, collection,  deleteDoc, setDoc,
 } from "firebase/firestore";
 import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useSubscription,   } from 'colay-ui'
import { useImmer,   } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8I11ntIAhLCoz2iw2cWVZl6NoWQ44yR0",
  authDomain: "perfectgraph-5c619.firebaseapp.com",
  databaseURL: "https://perfectgraph-5c619.firebaseio.com",
  projectId: "perfectgraph-5c619",
  storageBucket: "perfectgraph-5c619.appspot.com",
  messagingSenderId: "214633043236",
  appId: "1:214633043236:web:fa42d761199303b786cfb1",
  measurementId: "G-GYX9R6E88Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

const PATHS = {
  projects: 'projects',
  nodes: 'nodes',
  edges: 'edges',
  users: 'users',
}

export const useAuth = () => {
  const [state, updateState] = useImmer({
    user: null,
    isLoading: true,
    signin: async () => {
      try {
        updateState(draft => {
          draft.isLoading = true
        })
        const result = await signInWithPopup(auth, new GoogleAuthProvider())
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        console.log('AA', result)
        const user = result.user;
        updateState(draft => {
          draft.isLoading = false
          draft.user = user
        })
      } catch (error) {
        alert('There is an error with your login! Refresh the page and try again!')
        console.log('error', error)
        // const errorCode = error.code;
        //   const errorMessage = error.message;
        //   // The email of the user's account used.
        //   const email = error.email;
        //   // The AuthCredential type that was used.
        //   const credential = GoogleAuthProvider.credentialFromError(error);
      }
    }
  })
  React.useEffect(() => {
    const call = async () => {
      const user = await new Promise((res, rej) => {
        auth.onAuthStateChanged((user, error) => {
          res(user)
        })
      })
      updateState((draft) => {
        draft.isLoading = false
        draft.user = user 
      })
    }
    call()
  }, [])
  return state
}

type Event = {
  type: string;
  elementType: 'nodes' | 'edges' | 'users';
  data: any
}
type SubscriptionConfig = {
  projectId: string;
  onEvent: (event: Event) => void;
}

export const useProjectSubscription = (config: SubscriptionConfig) => { 
  const {
     onEvent,
     projectId,
  } = config
  // useSubscription(() => {
  //   const ref = doc(firestore, `${PATHS.projects}/${projectId}`)
  //     onSnapshot(ref,querySnapshot => {
  //       const data = querySnapshot.data()

  //     });
  // })
  // NODES
  useSubscription(() => {
    const ref = collection(firestore, `${PATHS.projects}/${projectId}/${PATHS.nodes}`)
    onSnapshot(ref,querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        const data = change.doc.data()
        onEvent({
          elementType: 'nodes',
          data,
          type: change.type,
        })
      });
    });
  })
  // EDGES
  useSubscription(() => {
    const ref = collection(firestore, `${PATHS.projects}/${projectId}/${PATHS.edges}`)
    onSnapshot(ref,querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        const data = change.doc.data()
        onEvent({
          elementType: 'edges',
          data,
          type: change.type,
        })
      });
    });
  })
  
}

type CreateNodeVariables = {
  projectId: string;
  item: any
}
export async function createNode(variables: CreateNodeVariables) {
  const {
    projectId,
    item
  } = variables
  try {
    const id = R.uuid()
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.nodes}/${item.id}`)
    setDoc(
      ref,
      item,
    )
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type DeleteNodeVariables = {
  id: string;
  projectId: string;
}
export async function deleteNode(variables: DeleteNodeVariables) {
  const { 
    id,
    projectId,
  } = variables
  try {
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.nodes}/${id}`)
    deleteDoc(ref)
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type UpdateNodeVariables = {
  item: any;
  projectId: string;
}
export async function updateNode(variables: UpdateNodeVariables) {
  const {
    item,
    projectId,
  } = variables
  try {
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.nodes}/${item.id}`)
    updateDoc(
      ref,
      {
        data: item.data
      }
    )
  } catch (err) {
    console.log('error creating node:', err)
  }
}


type CreateEdgeVariables = {
  projectId: string;
  item: any
}
export async function createEdge(variables: CreateEdgeVariables) {
  const {
    projectId,
    item
  } = variables
  try {
    const id = R.uuid()
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.edges}/${item.id}`)
    setDoc(
      ref,
      item
    )
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type DeleteEdgeVariables = {
  id: string;
  projectId: string;
}
export async function deleteEdge(variables: DeleteEdgeVariables) {
  const { 
    id,
    projectId,
  } = variables
  try {
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.edges}/${id}`)
    deleteDoc(ref)
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type UpdateEdgeVariables = {
  item: any;
  projectId: string;
}
export async function updateEdge(variables: UpdateEdgeVariables) {
  const {
    item,
    projectId,
  } = variables
  try {
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.edges}/${item.id}`)
    updateDoc(
      ref,
      {
        data: item.data
      }
    )
  } catch (err) {
    console.log('error creating node:', err)
  }
}


type UpdateUserVariables = {
  user: any;
  projectId: string;
}

export async function updateUser(variables: UpdateUserVariables) {
  const {
    user,
    projectId,
  } = variables
  try {
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.users}/${user.id}`)
    setDoc(
      ref,
      user
    )
  } catch (err) {
    console.log('error update user:', err)
  }
}

type DeleteUserVariables = {
  id: string;
  projectId: string;
}

export async function deleteUser(variables: DeleteUserVariables) {
  const {
    id,
    projectId,
  } = variables
  try {
    const ref = doc(firestore,`${PATHS.projects}/${projectId}/${PATHS.users}/${id}`)
    deleteDoc(
      ref,
    )
  } catch (err) {
    console.log('error deleting user:', err)
  }
}

export const useUserSubscription = (config: SubscriptionConfig) => { 
  const {
     onEvent,
     projectId,
  } = config
  useSubscription(() => {
    const ref = collection(firestore, `${PATHS.projects}/${projectId}/${PATHS.users}`)
    onSnapshot(ref,querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        const data = change.doc.data()
        onEvent({
          elementType: 'users',
          data,
          type: change.type,
        })
      });
    });
  })
}

// export function onCreateNode(callback: (node: any) => void) {
//   try {
//      return API.graphql({
//       query: ON_CREATE_NODE,
//       authMode: API_AUTH_MODE.API_KEY,
//     }).subscribe((nodeData) => {
//       const nodeRaw = nodeData.value.data.onCreateNode
//       callback(convertJSONStringFields(nodeRaw))
//     })
//   } catch (err) {
//     console.log('error creating node:', err)
//   }
// }
// export function onUpdateNode(callback: (node: any) => void) {
//   try {
//      return API.graphql({
//       query: ON_UPDATE_NODE,
//       authMode: API_AUTH_MODE.API_KEY,
//     }).subscribe((nodeData) => {
//       const nodeRaw = nodeData.value.data.onUpdateNode
//       callback(convertJSONStringFields(nodeRaw))
//     })
//   } catch (err) {
//     console.log('error creating node:', err)
//   }
// }

// export function onDeleteNode(callback: (id: string) => void) {
//   try {
//     return API.graphql({
//       query: ON_DELETE_NODE,
//       authMode: API_AUTH_MODE.API_KEY,
//     }).subscribe((nodeData) => {
//       const nodeRaw = nodeData.value.data.onDeleteNode
//       callback(nodeRaw.id)
//     })
//   } catch (err) {
//     console.log('error creating node:', err)
//   }
// }

// export function onCreateEdge(callback: (node: any) => void) {
//   try {
//      return API.graphql({
//       query: ON_CREATE_EDGE,
//       authMode: API_AUTH_MODE.API_KEY,
//     }).subscribe((edgeData) => {
//       const edgeRaw = edgeData.value.data.onCreateEdge
//       callback(convertJSONStringFields(edgeRaw))
//     })
//   } catch (err) {
//     console.log('error creating node:', err)
//   }
// }
// export function onUpdateEdge(callback: (edge: any) => void) {
//   try {
//     return API.graphql({
//       query: ON_UPDATE_EDGE,
//       authMode: API_AUTH_MODE.API_KEY,
//     }).subscribe((edgeData) => {
//       const edgeRaw = edgeData.value.data.onUpdateEdge
//       callback(convertJSONStringFields(edgeRaw))
//     })
//   } catch (err) {
//     console.log('error creating node:', err)
//   }
// }
// export function onDeleteEdge(callback: (id: string) => void) {
//   try {
//     return API.graphql({
//       query: ON_DELETE_EDGE,
//       authMode: API_AUTH_MODE.API_KEY,
//     }).subscribe((edgeData) => {
//       const edgeRaw = edgeData.value.data.onDeleteEdge
//       callback(edgeRaw.id)
//     })
//   } catch (err) {
//     console.log('error creating node:', err)
//   }
// }