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
        paddingHorizontal:15,
        marginLeft: 32
    },
    listContainer:{
        paddingHorizontal:16,
        paddingVertical:32,
        marginTop: 50,
        borderRadius:6,
        marginHorizontal:12,
        alignItems: 'center',
        width: 200,
        backgroundColor: Constants.Colors.Cyan
    },
    listTitle:{
        fontSize:24,
        fontWeight:'700',
        color:"white",
        marginBottom:18
    },
}));