let express = require("express");
let app = express();
app.use(express.json());
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");
let dbPath = path.join(__dirname, "moviesData.db");
let db = null;
let connectDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("server started");
    });
  } catch (err) {
    console.log(`there is an ${err.message}`);
  }
};
connectDatabase();

app.get("/movies/", async (request, response) => {
  let getQuery = `
    SELECT * 
    FROM  movie;
    `;
  let getResponse = await db.all(getQuery);

  let movieNames = [];
  for (let i of getResponse) {
    movieNames.push({ movieName: i.movie_name });
  }
  console.log(getResponse);
  response.send(movieNames);
});

app.post("/movies/", async (request, response) => {
  let movieDetails = request.body;
  console.log(movieDetails);
  let { directorId, movieName, leadActor } = movieDetails;
  console.log(directorId);
  let postQuery = `
  INSERT INTO 
     movie (director_id,movie_name,lead_actor)
  VALUES
  (    
      ${directorId},
      '${movieName}',
      '${leadActor}'
   )`;
  await db.run(postQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  console.log(movieId);
  let get2Query = `
          SELECT *
          FROM movie 
          WHERE movie_id = ${movieId};
    `;
  let movieDetail = await db.get(get2Query);
  console.log(movieDetail);
  let ans = {
    movieId: movieDetail.movie_id,
    directorId: movieDetail.director_id,
    movieName: movieDetail.movie_name,
    leadActor: movieDetail.lead_actor,
  };
  response.send(ans);
});

app.put("/movies/:movieId/", async (request, response) => {
  let updateDetails = request.body;
  let { movieId } = request.params;
  let { directorId, movieName, leadActor } = updateDetails;
  console.log(directorId);
  console.log(movieId);
  let putQuery = `
            UPDATE movie
            SET 
              director_id = ${directorId},
              movie_name = '${movieName}',
              lead_actor = '${leadActor}'
            WHERE movie_id = ${movieId};
     `;
  await db.run(putQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  let deleteQuery = `
       DELETE FROM movie
       WHERE movie_id = ${movieId}
    `;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  let get3Query = `
          SELECT *
          FROM  director`;
  let responseDirector = await db.all(get3Query);
  console.log(responseDirector);

  let responseList = responseDirector.map((val) => {
    let ans = {
      directorId: val.director_id,
      directorName: val.director_name,
    };
    return ans;
  });
  response.send(responseList);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  let { directorId } = request.params;
  let joinQuery = `
            SELECT *
            FROM movie NATURAL JOIN director
            WHERE movie.director_id = ${directorId};
    `;
  let joinResponse = await db.all(joinQuery);
  let finalResponse = joinResponse.map((val) => {
    let finalAns = { movieName: val.movie_name };
    return finalAns;
  });
  response.send(finalResponse);
});

module.exports = app;

    response.send(finalResponse);
})

module.exports = app;
