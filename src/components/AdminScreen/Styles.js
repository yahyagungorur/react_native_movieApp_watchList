import { StyleSheet } from "react-native";

export default (Styles = StyleSheet.create({
  cardView: {
    backgroundColor: "black",
    margin: 10,
    elevation: 5
  },
  buttonContainer: {
    marginBottom: 10,
    marginLeft: 33,
    padding: 5,
    backgroundColor: "#02ADAD",
    width: 150,
    borderRadius: 10
  },
  buttonText: { color: "black", margin: 5, alignSelf: "center", flexWrap:"wrap"},
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
  image2: { width: 80, height: 110, marginLeft: 5, margin: 20 },
  divider:{
    backgroundColor:"lightBlue",
    flex: 1,
    height: 1,
    alignSelf:'center'
},
title:{
    fontSize:38,
    fontWeight:'800',
    color:"black",
    paddingHorizontal:15,
    marginLeft: 32
},
dropdown: {
  height: 50,
  borderColor: 'gray',
  borderWidth: 0.5,
  borderRadius: 8,
  paddingHorizontal: 8,
},
icon: {
  marginRight: 5,
},
label: {
  position: 'absolute',
  backgroundColor: 'white',
  left: 22,
  top: 8,
  zIndex: 999,
  paddingHorizontal: 8,
  fontSize: 14,
},
placeholderStyle: {
  fontSize: 16,
},
selectedTextStyle: {
  fontSize: 16,
},
iconStyle: {
  width: 20,
  height: 20,
},
inputSearchStyle: {
  height: 40,
  fontSize: 16,
},
}));
