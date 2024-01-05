import { View, Text, StatusBar, ScrollView, Image,TouchableOpacity } from "react-native";
import React, { Component } from "react";
import Constants from "./../utilities/Constants";
import { callRemoteMethod, getMovieDetails } from "../utilities/WebServiceHandler";
import Loader from "../utilities/Loader";
import Styles from "./Styles";
import { renderIf } from "../utilities/CommonMethods";
import DbContext from "./../utilities/DBContext"
import {addDoc,app,collection,db,getFirestore, getDocs,where,query,updateDoc,Timestamp} from "./../utilities/FireStore";

const dbs = new DbContext();
/**
 * @author Vaibhav Padalia
 * @description This component shows detailed description about 
 * a movie (id) that has been passed from previous component.
 */
class SecondScreen extends Component {


  constructor(props) {
    super(props);
    this.state = {
      movieList: [], // The list of movies to be displayed after search.
      isLoading: false,
      movieDetails:{} // Whether loader is to be shown.   
    };
  }
  static navigationOptions = {
    headerTitle: ""
  };

  async componentDidMount() {
     this.getMovieList();
  }

  getMovieList = async()=>{
    let list = [];
    this.setState({isLoading : true});      
    if (this.props.navigation.state.params.id == 1){
      dbs.MovieList(0,0,0).then((list)=>{
        list.map(async id =>{
           this.getMovieDetails(id);    
       })
       this.setState({isLoading : false});      
      });    
    } 
    else {
      dbs.MovieList(0,1,0).then((list)=>{
        list.map(async id =>{
           this.getMovieDetails(id);    
       })
       this.setState({isLoading : false});      
      });    
    }
  } 

  getMovieDetails = id =>{
    var endpoint = Constants.URL.BASE_URL + "movie/" + id + "?api_key=" + Constants.URL.API_KEY;
    callRemoteMethod(this, endpoint, "GET", true).then((detail)=>{
      this.setState({ movieList: [...this.state.movieList, detail] });
    });
  };

  addWatchedListButtonPressed = async (movieID,movieName) => {
    try {
      dbs.UpdateMovie(movieID, 1, 0);
      this.updateState(movieID);
      const movie = query(collection(db, "watchedList"), where("MovieID", "==", movieID));
      getDocs(movie).then((response)=>{
        if(response.size > 0){
          var item = response.docs[0];
          updateDoc(item.ref, {
            Count: item.data().Count + 1,
            Date: Timestamp.fromDate(new Date())
          }); 
        }else {
          const mv = addDoc(collection(db,"watchedList"),{
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

  addDeletedListButtonPressed =(id) => {
    dbs.UpdateMovie(id, 1, 1);
    this.updateState(id);
  };

  updateState = (id)=>{
    const newList = this.state.movieList.filter((item) => item.id !== id);
    this.setState({ movieList: newList });
  }

 title =()=>{
  return(
    <View style={{flexDirection: 'row'}}>
    <View style={Styles.divider} />
    <Text style={Styles.title}>
      {this.props.navigation.state.params.id == 1? Constants.Strings.TOWATCH_TITLE : Constants.Strings.WATCHED_TITLE}
      <Text style={{fontWeight: '300', color: Constants.Colors.Cyan}}> List</Text>
    </Text>
    <View style={Styles.divider} />
  </View>
  );
 }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? <Loader show={true} loading={this.state.isLoading} /> : null}
        <StatusBar backgroundColor={Constants.Colors.Cyan} barStyle="light-content" />
        {this.title()}
        {renderIf(this.state.noData, <Text style={{ textAlign: "center", color:"black" }}>No data found.</Text>)}
        {renderIf(
          this.state.movieList.length,
          <ScrollView style={Styles.movieList} showsVerticalScrollIndicator={false}>
            <View>
              {this.state.movieList.map(function(obj, i) {
                return (
                  <TouchableOpacity
                    // onPress={() => this.props.navigation.navigate("SecondScreen", { id: obj.id })}
                    onPress={()=>{}}
                    disabled={true}
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
                        {renderIf(this.props.navigation.state.params.id == 1, 
                          <TouchableOpacity onPress={() => this.addWatchedListButtonPressed(obj.id,obj.original_title)} style={Styles.buttonContainer}>
                              <Text style={Styles.buttonText}>{Constants.Strings.WATCHED_BUTTON}</Text>
                          </TouchableOpacity>                        
                        )}
                        {renderIf(this.props.navigation.state.params.id == 2, 
                          <TouchableOpacity onPress={() => this.addDeletedListButtonPressed(obj.id,obj.original_title)} style={Styles.buttonContainer}>
                              <Text style={Styles.buttonText}>{Constants.Strings.DELETE_BUTTON}</Text>
                        </TouchableOpacity>                         
                        )}
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

export default SecondScreen;
