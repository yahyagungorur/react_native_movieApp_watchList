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
const db = new DbContext();
/**
 * @author Vaibhav Padalia
 * @description This is the first screen that loads when the app starts. This screen shows the list of movies
 * according to the search query.
 */
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

  openPanel = async (id) => {
    console.log("Panel Opened id:"+ id) ;
    await this.getMovieDetails(id);
    this.setState({ isPanelActive: true });
  };

  closePanel = async() => {
    console.log("Panel Closed");
    this.setState({ isPanelActive: false });
  };


  getMovieDetails = async id =>{
    var endpoint = Constants.URL.BASE_URL + "movie/" + id + "?" + Constants.URL.API_KEY;
    const detail = await callRemoteMethod(this, endpoint, "GET", true);
    this.getMovieDetailsCallback(detail);
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
      var endpoint =
        Constants.URL.BASE_URL + Constants.URL.SEARCH_QUERY + this.state.searchText + "&" + Constants.URL.API_KEY;
      const list = await callRemoteMethod(this, endpoint, "GET", true);
      const idLists = await db.MovieList(0,0,0);
      this.setState({ willWathIDList: idLists });
      const watchedIdList = await db.MovieList(0,1,0);
      this.setState({ watchedIDList: watchedIdList });
      this.searchCallback(list);
      Keyboard.dismiss();
    } else {
      customAlert(Constants.Strings.MSG);
    }
  };

  addWatchListButtonPressed = async id => {
      await db.AddMovie(id);
      await this.searchButtonPressed();
      customAlert("Added Watch List");
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
                  <TouchableOpacity
                    // onPress={() => this.props.navigation.navigate("SecondScreen", { id: obj.id })}
                    onPress={() => this.openPanel(obj.id)}
                    key={i}
                    style={{ margin: 10, marginBottom: 5 }}>
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
                      <Text numberOfLines={3} style={[Styles.buttonText,{ fontSize: 17 }]}>
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
                        <View style={Styles.rowView}>
                          {
                            this.state.willWathIDList.includes(obj.id)?
                            <TouchableOpacity onPress={() => {}} style={Styles.buttonAddedContainer} disabled={true}>
                            <Text style={Styles.buttonText}>Already Added List</Text>
                          </TouchableOpacity> :
                          this.state.watchedIDList.includes(obj.id)?
                          <TouchableOpacity onPress={() => {}} style={Styles.buttonWatchedContainer} disabled={true}>
                          <Text style={Styles.buttonText}>Already Watched</Text>
                        </TouchableOpacity> :
                          <TouchableOpacity onPress={() => this.addWatchListButtonPressed(obj.id)} style={Styles.buttonContainer}>
                          <Text style={Styles.buttonText}>{Constants.Strings.ADD_BUTTON}</Text>
                        </TouchableOpacity>
                          }
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
