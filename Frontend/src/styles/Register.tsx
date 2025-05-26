import { StyleSheet } from "react-native";
import Colors from "./Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  logo: {
    width: "100%",
    height: 160,
  
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  formContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexItem: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  photoButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  photoButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  photoList: {
    marginVertical: 10,
  },
  photoPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    width: "100%",
   
    alignItems: "center",
  },
});
