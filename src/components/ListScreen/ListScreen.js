import React, {useState, setState,Component} from 'react';
import { View, Text,TouchableOpacity} from "react-native";
import Styles from "./Styles";
import Constants from "./../utilities/Constants";
import { renderIf } from "../utilities/CommonMethods";
import DbContext from "./../utilities/DBContext";
const db = new DbContext();

export default class ListScreen extends Component {

  constructor(props) {
    super(props)  
    this.state = {
      records: [],
      lists :[
        {name : "Movie List", screen:"MainScreen", id: 0},
        {name : "Movies to watch", screen:"SecondScreen", id: 1},
        {name : "Watched Movies",screen:"SecondScreen", id: 2},
        {name : "Admin Screen", screen: "AdminScreen", id:3}
    ]
    }
    db.createTable();
  }
  static navigationOptions = {
      headerTitle: Constants.Strings.LIST_TITLE
  };
 
  

  render() {
    return (
      <View style={Styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={Styles.divider} />
          <Text style={Styles.title}>
            Movie
            <Text style={{fontWeight: '300', color: Constants.Colors.Cyan}}> Lists</Text>
          </Text>
          <View style={Styles.divider} />
        </View>
        <View style={{height: 275, alignSelf:"center"}}>
        {renderIf(
          this.state.lists.length,
            <View>
              {this.state.lists.map(function(obj, i) {
                return (
                    <TouchableOpacity style ={[Styles.listContainer]}
                    key={i}
                    onPress={() => this.props.navigation.navigate(obj.screen,{id:obj.id})}>
                        <Text style={Styles.listTitle} numberOfLines={1}>
                        {obj.name}
                        </Text>
                    </TouchableOpacity>
                )
              }, this)}
            </View>
        )}
        </View>
      </View>
    );
  }
}
