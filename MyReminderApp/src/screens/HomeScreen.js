import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Button,
  ImageBackground,
} from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";

import * as Notifications from "expo-notifications";

import { getAuth, signOut } from "firebase/auth";

import {
  loadNonCompletionTasks,
  deleteSelectedTask,
  changeTaskStatus,
  loadTask,
} from "../utils/TaskDatabase";
import { daysOfWeek } from "../utils/useTaskState";
import {
  SaveTaskNotification,
  cancelScheduledNotification,
} from "../utils/notification";
import { useUser } from "../utils/UserContext";
import TaskListItem from "../styles/taskListItem";

function HomeScreen({ navigation, route }) {
  const [tasks, setTasks] = useState([]);
  const { userId } = useUser();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadTasks();
      requestPermissionsAsync();
    });

    // ヘッダーにログアウトボタンを設定
    navigation.setOptions({
      headerTitle: "Routine Timer", // ヘッダーの真ん中のタイトルを"Routine Timer"に変更する
      headerTitleStyle: {
        fontSize: 24, // ヘッダータイトルのフォントサイズを大きくする
      },
      headerLeft: null, // 戻るボタンのタイトルを非表示にする
      headerRight: () => (
        <Button
          onPress={() => {
            signOut(auth).then(() => {
              // ログアウト成功
              Alert.alert("Logout", "You have been logged out.", [
                { text: "OK", onPress: () => navigation.navigate("Title") },
              ]);
            }).catch((error) => {
              // ログアウト失敗、エラー処理
              Alert.alert("Logout Error", error.message);
            });
          }}
          title="Logout"
          color="#FFF"
        />
      ),
    });

    return unsubscribe;
  }, [navigation, userId]);

  const loadTasks = async () => {
    try {
      const tasks = await loadNonCompletionTasks(userId);
      setTasks(tasks);
      
    } catch (error) {
      Alert.alert("Error loading tasks", error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteSelectedTask(id);
      await cancelScheduledNotification(String(id));
      await loadTasks();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const statusUpdate = async (newStatus, id) => {
    // Set notifications
    if(newStatus) {
      try{
        await cancelScheduledNotification(String(id));
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      try {
        const task = await loadTask(id);
        if (task[0].isnotification) {
          await SaveTaskNotification(task[0]);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
    // Update task status
    values = [newStatus ? 1: 0, id];
    try {
      await changeTaskStatus(values);
      await loadTasks();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const requestPermissionsAsync = async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) {
      return;
    }

    await Notifications.requestPermissionsAsync();
  };

  return (
    <ImageBackground
      source={require("../../assets/timer.png")}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      {/* Your existing content here */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskListItem
            styles={styles}
            item={item}
            daysOfWeek={daysOfWeek}
            navigation={navigation}
            statusUpdate={statusUpdate}
            deleteTask={deleteTask}
          />
        )}
      />

      <TouchableOpacity
        style={styles.completeTasksButtonBase}
        onPress={() =>
          navigation.navigate("CompleteTaskList", { userId: userId })
        }
      >
        <View style={styles.completeTasksButton}>
          <AntDesign name="check" size={40} color="white" />
          <Text style={styles.completeTasksText}>Completed Tasks</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('TaskDetail', { userId: userId })}
      >
        <AntDesign name="pluscircle" size={85} color="#2D3F45" />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  line: {
    borderBottomColor: "#B3B3B3",
    borderBottomWidth: 3,
    marginBottom: 10, 
  },
  container: {
    flex: 1,
    backgroundColor: "#B3B3B3",
  },
  backgroundImage: {
    resizeMode: "contain",
    width: "100%",
    height: "180%",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 0,
  },
  taskText: {
    fontSize: 30,
    fontboldWeight: "bold",
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 85, 
    width: 85, 
    borderRadius: 60, 
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 0,
  },

  completeTasksButtonBase: {
    position: "absolute",
    left: 30,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 0,
    height: 50,
    width: 200,
    borderRadius: 30,
    backgroundColor: "#2D3F45", 
  },
  completeTasksButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  completeTasksText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  flatListContainer: {
    flexGrow: 1, 
    marginTop: 5,
    marginBottom: 5, 
  },
  actionsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  complete: {
    marginVertical: 10,
    alignItems: "center",
  },
  actionItem: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 10, 
    marginRight: 10,
    marginLeft: 10,
  },
});

export default HomeScreen;
