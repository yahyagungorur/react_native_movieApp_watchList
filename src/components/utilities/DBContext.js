
import SQLite from 'react-native-sqlite-storage';
import { customAlert } from "./CommonMethods";

const db = new SQLite.openDatabase({
        name: 'MovieAppDB',
        location:'default'
    },
    ()=>{
        console.log("Db Created");
    },
    error =>{
        customAlert("Error can't open db ExMSG: "+ error);
    }
);

export default class DbContext {

    createTable =()=>{
        db.transaction((tx)=>{
            console.log("db :" + db);
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"Movies "
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, MoviesID INTEGER, IsWatched INTEGER, IsDeleted INTEGER);",[],(tx,results) => {
                    console.log("table tx",tx);
                    console.log("table results",results);
                }
            );
        });
    }

    AddMovie = async (MoviesID) =>{
        await db.transaction((tx)=>{
            tx.executeSql(
                "INSERT INTO Movies(MoviesID,IsWatched,IsDeleted) VALUES(?,?,?)",[MoviesID,0,0],(tx,results) => {
                    console.log("AddMovie tx",tx);
                    console.log("AddMovie results",results);
                }
            );
        });
    }

    UpdateMovie = async (MoviesID,IsWatched,IsDeleted) =>{
        let query = "UPDATE Movies SET IsWatched = '"+IsWatched.toString()+ "', IsDeleted = '"+ IsDeleted.toString()  + "' WHERE MoviesID = '"+ MoviesID.toString()+"'";
        console.log("query : ",query);
        await db.transaction((tx)=>{
            tx.executeSql(
                query,
                [],(tx,results) => {
                    console.log("UpdateMovie tx",tx);
                    console.log("UpdateMovie results",results);
                },
                error =>{
                    customAlert("Error can't Update db ExMSG: "+ error);
                }
            );
        });
    }

    MovieList = async (MoviesID,IsWatched,IsDeleted)=>{

        let moviesIDList =[];
        let query = "SELECT * FROM Movies WHERE IsWatched = '"+IsWatched.toString()+ "' AND IsDeleted = '"+ IsDeleted.toString()+"'";
        if(MoviesID != 0){
            query = query + "AND MoviesID ='"+ MoviesID.toString() +"'";
        }
        console.log("query : ",query);
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
             tx.executeSql(
                query,[],
                (tx, results) => {
                    console.log("MovieList tx",tx);
                    console.log("MovieList results",results);
                    var len= results.rows.length;
                    console.log("len : "+ len);
                    for (var i = 0; i < len; ++i) {
                        var obj = results.rows.item(i).MoviesID;
                        moviesIDList.push(obj);
                    }
                    console.log("MovieList :" + moviesIDList);                
                    resolve(moviesIDList)
                },
                error => {
                    customAlert("Error can't select db ExMSG: "+ error);
                    reject(error)
                },
             );
            });
        });
    }

}
