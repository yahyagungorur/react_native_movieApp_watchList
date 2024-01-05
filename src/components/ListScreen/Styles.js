import { StyleSheet } from "react-native";
import Constants from "./../utilities/Constants";

export default (Styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyItems :'center'
    },
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
    },
    listContainer:{
        paddingHorizontal:16,
        paddingVertical:16,
        marginTop: 50,
        borderRadius:6,
        alignItems: 'center',
        width: "100%",
        backgroundColor: Constants.Colors.Cyan,
        height:75
    },
    listTitle:{
        fontSize:24,
        fontWeight:'700',
        color:"white",
        marginBottom:18
    },
}));