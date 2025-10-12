// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    if (!userToDelete) {
      console.log("User not found at index", index);
      return;
    }

    deleteUser(userToDelete._id)
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else if (res.status === 404) {
          console.log("User not found in backend");
        }
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
  }

  function fetchUsers(name, job) {
    let url = "http://localhost:8000/users";
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (job) params.append('job', job);
    if (params.toString()) url += '?' + params.toString();
    return fetch(url);
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    return promise;
  }

  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleSearch(searchData) {
    fetchUsers(searchData.name, searchData.job)
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} handleSearch={handleSearch} />
    </div>
  );
}


export default MyApp;