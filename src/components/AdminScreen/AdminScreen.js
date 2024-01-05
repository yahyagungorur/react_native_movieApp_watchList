import { View, Text, StatusBar, ScrollView, Image,TouchableOpacity } from "react-native";
import React, { Component } from "react";
import Constants from "../utilities/Constants";
import { callRemoteMethod, getMovieDetails } from "../utilities/WebServiceHandler";
import Loader from "../utilities/Loader";
import Styles from "./Styles";
import { renderIf } from "../utilities/CommonMethods";
import DbContext from "../utilities/DBContext";
import {addDoc,app,collection,db,getFirestore, getDocs,where,query,orderBy} from "./../utilities/FireStore";
//import { Dropdown } from 'react-native-element-dropdown';


const dbs = new DbContext();
const orderByList = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieList: [], // The list of movies to be displayed after search.
      isLoading: false,
      movieDetails:{},
      value:null,
      isFocus:false // Whether loader is to be shown.   
    };
  }
  static navigationOptions = {
    headerTitle: Constants.Strings.ADMIN_TITLE
  };
  async componentDidMount() {
    //this.getMovieList();
  }

  getWatchMovieList = function(){
    try {
      this.setState({isLoading : true,movieList: []});
      const movieRef= query(collection(db, "movieList"),orderBy("Count","desc"));
      getDocs(movieRef).then((response)=>{
        if(response.size > 0){
          response.docs.map(async item =>{
            this.setState({ movieList: [...this.state.movieList, item.data()] });       
          })
        }
        this.setState({isLoading : false});
      });
    } catch (error) {
      console.log(error);
      this.setState({isLoading : false});
    }
  }

  getWatchedMovieList = function(){
    try {
      this.setState({isLoading : true,movieList: []});
      const movieRef= query(collection(db, "watchedList"),orderBy("Count","desc"));
      getDocs(movieRef).then((response)=>{
        if(response.size > 0){ 
          response.docs.map(async item =>{
            this.setState({ movieList: [...this.state.movieList, item.data()] });       
          })
        }
        this.setState({isLoading : false});
      });
    } catch (error) {
      console.log(error);
      this.setState({isLoading : false});
    } 
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        <View style={{flexDirection: 'column'}}>
          <View style={Styles.rowView}>
            <TouchableOpacity onPress={() =>this.getWatchMovieList()} style={Styles.buttonContainer}>
                  <Text style={Styles.buttonText}>All Watch List</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>this.getWatchedMovieList()} style={Styles.buttonContainer}>
                <Text style={Styles.buttonText}>All Watched List</Text>
          </TouchableOpacity>  
          </View>
          {renderIf(this.state.movieList.length > 0,          
            <View style={Styles.rowView}>
                <Text style={Styles.buttonText}>**Ordered by popularity</Text>
                {/* <Dropdown
                      style={[Styles.dropdown, isFocus && { borderColor: 'blue' }]}
                      placeholderStyle={Styles.placeholderStyle}
                      selectedTextStyle={Styles.selectedTextStyle}
                      inputSearchStyle={Styles.inputSearchStyle}
                      iconStyle={Styles.iconStyle}
                      data={orderByList}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select item' : '...'}
                      searchPlaceholder="Search..."
                      value={value}
                      onFocus={() => this.setState({isFocus:true})}
                      onBlur={() => this.setState({isFocus:false})}
                      onChange={item => {
                        console.log(item.value);
                        this.setState({isFocus:true});
                      }}
                    /> */}
            </View> 
          )}
         </View> 
        {renderIf(this.state.movieList.length == 0, <Text style={{ textAlign: "center", color:"black" }}>No data found.</Text>)}
        {renderIf(
          this.state.movieList.length,
          <ScrollView style={Styles.movieList} showsVerticalScrollIndicator={false}>
            <View>
              {this.state.movieList.map(function(obj, i) {
                return (
                  <TouchableOpacity
                    onPress={()=>{}}
                    disabled={true}
                    key={i}
                    style={{ margin: 10, marginBottom: 5 }}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flexDirection: "column" }}>
                        <View style={Styles.rowView}>
                          <Text style={Styles.buttonText}>{Constants.Strings.MOVIE_TITLE}</Text>
                          <Text numberOfLines={3} style={[Styles.buttonText,{ fontSize: 17,fontWeight:"700" }]}>{obj.MovieName}</Text>
                        </View>
                        <View style={Styles.rowView}>
                          <Text style={Styles.buttonText}>{Constants.Strings.LAST_ADDED_DATE}</Text>
                          <Text style={Styles.buttonText}>{obj.Date.toDate().toLocaleString()}</Text>
                        </View>
                        <View style={Styles.rowView}>
                          <Text style={Styles.buttonText}>{Constants.Strings.POPULARITY}</Text>
                          <Text style={Styles.buttonText}>{obj.Count}</Text>
                        </View>       
                      </View>
                    </View>
                    <View style={Styles.lineView} />
                  </TouchableOpacity>
                );
              }, this)}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

export default AdminScreen;
