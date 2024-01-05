import { View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Image,Keyboard } from "react-native";
import React, { Component, useState } from "react";
import Loader from "./../utilities/Loader";
import { callRemoteMethod,getMovieDetails } from "../utilities/WebServiceHandler";
import Constants from "./../utilities/Constants";
import { renderIf } from "../utilities/CommonMethods";
import Styles from "./Styles";
import { customAlert } from "./../utilities/CommonMethods";
import {SwipeablePanel} from 'rn-swipeable-panel';
import DbContext from "./../utilities/DBContext";
import {addDoc,app,collection,db,getFirestore, getDocs,where,query,updateDoc,Timestamp} from "./../utilities/FireStore";

const dbs = new DbContext();

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieList: [], // The list of movies to be displayed after search.
      isLoading: false, // Whether loader is to be shown.
      searchText: "", // Text that is to be searched.
      noData: false,
      isPanelActive : false,
      movieDetails: {},
      willWathIDList:[],
      watchedIDList: [] // Will contain details about a particular movie.     
    };
  }
  static navigationOptions = {
    headerTitle: Constants.Strings.MAIN_TITLE
  };


 panelProps = {
    fullWidth: true,
    openLarge: true,
    showCloseButton: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // ...or any prop you want
  };

  /*openPanel = async (id) => {
    console.log("Panel Opened id:"+ id) ;
    this.getMovieDetails(id);
    this.setState({ isPanelActive: true });
  };*/

  closePanel = async() => {
    console.log("Panel Closed");
    this.setState({ isPanelActive: false });
  };


  getMovieDetails = async id =>{
    var endpoint = Constants.URL.BASE_URL + "movie/" + id + "?" + Constants.URL.API_KEY;
    callRemoteMethod(this, endpoint, "GET", true).then((detail)=>{
      this.getMovieDetailsCallback(detail);
    });
  };

  /**
   * @description Set data into movieDetails
   */

  getMovieDetailsCallback = response => {
    console.log("Panel Opened response:"+ response) ;
    this.setState({ movieDetails: response });
  };
  /**
   * @description Function to search the entered query.
   * @param searchText The word that is to be searched.
   */

 searchButtonPressed = async () => {
    if (this.state.searchText.length) {
      this.setState({isLoading : true});
      var endpoint =
        Constants.URL.BASE_URL + "search/movie?api_key=" +Constants.URL.API_KEY + "&query="+ this.state.searchText ;
      callRemoteMethod(this, endpoint, "GET", true).then((list)=>{
        this.searchCallback(list);
      });
      this.getUserMovieList();
      Keyboard.dismiss();
    } else {
      customAlert(Constants.Strings.MSG);
    }
  };

  getUserMovieList = ()=>{
    dbs.MovieList(0,0,0).then((idLists)=>{
      this.setState({ willWathIDList: idLists });
    });
    dbs.MovieList(0,1,0).then((watchedIdList)=>{
      this.setState({ watchedIDList: watchedIdList });
    });
  }


  addWatchListButtonPressed = async (movieID,movieName) => {
    try {
      dbs.AddMovie(movieID);
      this.getUserMovieList();
      //customAlert("Added Watch List");
      const movies = query(collection(db, "movieList"), where("MovieID", "==", movieID));
      getDocs(movies).then((response)=>{
        if(response.size > 0){
          var item = response.docs[0];
          updateDoc(item.ref, {
            Count: item.data().Count + 1,
            Date: Timestamp.fromDate(new Date())
          }); 
        }else {
          const mv = addDoc(collection(db,"movieList"),{
            MovieID: movieID,
            MovieName : movieName,
            Count: 1,
            Date: Timestamp.fromDate(new Date())
          });
        }
      });
    } catch (error) {
        console.log(error)
    }
  };



panelContent =()=>{
    return (
      <View style={{ backgroundColor: Constants.Colors.Grey }}>
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <ScrollView style={Styles.movieCard} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "column" }}>
            <Image
              style={Styles.image2}
              source={{
                uri:
                  this.state.movieDetails.poster_path != null
                    ? Constants.URL.IMAGE_URL + this.state.movieDetails.poster_path
                    : Constants.URL.PLACEHOLDER_IMAGE
              }}
            />
            <Text style={{ fontSize: 16, margin: 5, fontWeight: "bold" }}>{this.state.movieDetails.original_title}</Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.STATUS}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.status}</Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.RATINGS}</Text>
            <Text style={{ flex: 0.5 }}>
              {this.state.movieDetails.vote_average}
              /10
            </Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.POPULARITY}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.popularity}%</Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.BUDGET}</Text>
            <Text style={{ flex: 0.5 }}>${this.state.movieDetails.budget}</Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.REVENUE}</Text>
            <Text style={{ flex: 0.5 }}>${this.state.movieDetails.revenue}</Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.RUNTIME}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.runtime} min</Text>
          </View>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <Text style={{ flex: 0.5 }}>{Constants.Strings.LANGUAGE}</Text>
            <Text style={{ flex: 0.5 }}>{this.state.movieDetails.original_language}</Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ flex: 0.2 }}>{Constants.Strings.OVERVIEW}</Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ flexWrap: "wrap", flex: 0.8 }}>{this.state.movieDetails.overview}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }


  /**
   * @description Callback for searchButtonPressed()
   * @returns movieList
   */

  searchCallback = response => {
    if (response.results.length) {
      this.setState({ noData: false });
      this.setState({ movieList: response.results });
    } else {
      this.setState({ movieList: [] });
      this.setState({ noData: true });
    }
    this.setState({isLoading : false});
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        <View style={{ backgroundColor: Constants.Colors.Grey }}>
          <View style={Styles.cardView}>
            <View style={{ margin: 10 }}>
              <TextInput
                style={{ color: 'black' }}
                placeholder={Constants.Strings.PLACEHOLDER}
                placeholderTextColor="black" 
                onChangeText={text => this.setState({ searchText: text })}
                underlineColorAndroid={Constants.Colors.Transparent}
              />
              <View style={{ height: 1, backgroundColor: Constants.Colors.Grey, margin: 0 }} />
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={this.searchButtonPressed} style={Styles.buttonContainer}>
                <Text style={Styles.buttonText}>{Constants.Strings.SEARCH_BUTTON}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {renderIf(this.state.noData, <Text style={{ textAlign: "center", color:"black" }}>No data found.</Text>)}
        {renderIf(
          this.state.movieList.length,
          <ScrollView style={Styles.movieList} showsVerticalScrollIndicator={false}>
            <View>
              {this.state.movieList.map(function(obj, i) {
                return (
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={Styles.image}
                        source={{
                          uri:
                            obj.poster_path != null
                              ? Constants.URL.IMAGE_URL + obj.poster_path
                              : Constants.URL.PLACEHOLDER_IMAGE
                        }}
                      />
                      <View style={{ flexDirection: "column" }}>
                        <Text numberOfLines={3} style={[Styles.buttonText,{ fontSize: 17,fontWeight:"900" }]}>
                          {obj.original_title}
                        </Text>
                        <View style={Styles.rowView}>
                          <Text style={Styles.buttonText}>{Constants.Strings.RELEASE_DATE}</Text>
                          <Text style={Styles.buttonText}>{obj.release_date}</Text>
                        </View>
                        <View style={Styles.rowView}>
                          <Text style={Styles.buttonText}>{Constants.Strings.LANGUAGE}</Text>
                          <Text style={Styles.buttonText}>{obj.original_language}</Text>
                        </View>
                        <View style={Styles.rowView}>
                          <Text style={Styles.buttonText}>{Constants.Strings.POPULARITY}</Text>
                          <Text style={Styles.buttonText}>{obj.popularity} %</Text>
                        </View>
                        <View style={[Styles.rowView,{marginLeft:15}]}>
                          <Text style={[Styles.buttonText,{ fontSize: 15,fontWeight:"800" }]}>{Constants.Strings.OVERVIEW}</Text>
                        </View>         
                      </View>
                    </View>
                    <View style={{ flexDirection: "column"}}>
                      <View style={Styles.overView}>
                          <Text style={Styles.buttonText}>{obj.overview}</Text>
                      </View>  
                      <View style={[Styles.rowView,{alignSelf:"center"}]}>
                            {
                              this.state.willWathIDList.includes(obj.id)?
                              <TouchableOpacity onPress={() => {}} style={Styles.buttonWatchContainer} disabled={true}>
                              <Text style={Styles.buttonText}>Already Added List</Text>
                            </TouchableOpacity> :
                            this.state.watchedIDList.includes(obj.id)?
                            <TouchableOpacity onPress={() => {}} style={Styles.buttonWatchContainer} disabled={true}>
                            <Text style={Styles.buttonText}>Already Watched</Text>
                          </TouchableOpacity> :
                            <TouchableOpacity onPress={() => this.addWatchListButtonPressed(obj.id,obj.original_title)} style={Styles.buttonContainer}>
                            <Text style={Styles.buttonText}>{Constants.Strings.ADD_BUTTON}</Text>
                          </TouchableOpacity>
                            }
                      </View> 

                    </View>
    
                    <View style={Styles.lineView} />
                  </View>
                );
              }, this)}
            </View>
          </ScrollView>
        )}
        <SwipeablePanel onClose={() => this.closePanel()} 
        isActive={this.state.isPanelActive}
        closeOnTouchOutside = {true}
        >
          {this.panelContent()}
          </SwipeablePanel>
      </View>
    );
  }
}

export default MainScreen;
