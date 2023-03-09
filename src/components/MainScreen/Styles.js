import { StyleSheet } from "react-native";

export default (Styles = StyleSheet.create({
  cardView: {
    backgroundColor: "white",
    margin: 10,
    elevation: 5
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#02ADAD",
    width: 100,
    borderRadius: 10
  },
  buttonAddedContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "red",
    width: 100,
    borderRadius: 10
  },
  buttonWatchedContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "green",
    width: 100,
    borderRadius: 10
  },
  buttonText: { color: "black", margin: 5, alignSelf: "center" },
  lineView: { height: 2, marginTop: 10, backgroundColor: "#EDEDED" },
  movieList: { marginLeft: 10, marginRight: 10, backgroundColor: "white", elevation: 10 },
  image: { width: 120, height: 180, marginLeft: 5, marginRight: 20 },
  rowView: { flexDirection: "row", marginTop: 10 },

  movieCard: {
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "black",
    elevation: 10
  },
  image2: { width: 80, height: 110, marginLeft: 5, margin: 20 }
}));
