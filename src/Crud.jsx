import React, { useState, useEffect, useCallback } from "react";
import { app } from "./firebase";
import "./Crud.css";

const db = app.database().ref("CRUD");

const Crud = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  const fetchDataFromFirebase = useCallback(() => {
    db.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFetchData(fetchedData);
      }
    });
  }, []);

  const handleAdd = () => {
    if (name && email && phone) {
      db.push().set({
        Name: name,
        Email: email,
        Phone: phone,
      });
      alert("Data added successfully");
      setName("");
      setEmail("");
      setPhone("");
    } else {
      alert("Please fill all fields");
    }
  };

  const handleUpdate = () => {
    if (id) {
      db.child(id).update({
        Name: name,
        Email: email,
        Phone: phone,
      });
      alert("Data updated successfully");
      setId("");
      setName("");
      setEmail("");
      setPhone("");
    } else {
      alert("Please select a record to update");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      db.child(id).remove();
    }
  };

  const handleEdit = (data) => {
    setId(data.id);
    setName(data.Name);
    setEmail(data.Email);
    setPhone(data.Phone);
  };

  return (
    <>
      <div className="form_container">
        <h2>Add/Update Form</h2>
        <div className="box">
          <input
            type="text"
            placeholder="Full Name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="text"
            placeholder="Phone Number"
            autoComplete="off"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
      <div className="database">
        <h2>Crud Database</h2>
        <div className="container">
          {fetchData.map((data) => (
            <div className="box" key={data.id}>
              <h3>Name: {data.Name}</h3>
              <h3>Email: {data.Email}</h3>
              <h3>Phone: {data.Phone}</h3>
              <button onClick={() => handleEdit(data)}>Edit</button>
              <button onClick={() => handleDelete(data.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Crud;
