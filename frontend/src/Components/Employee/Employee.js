import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { API_URL } from "../../API_URL/api_url";
import { NavBar } from "./header";
import { MDBContainer, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import jsPDF from 'jspdf';
import QRCode from 'qrcode.react';
import { createRoot } from 'react-dom/client';

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_EMPLOYEE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "MODAL_TITLE_ADD_EMPLOYEE":
      return {
        ...state,
        modalTitle: "Add Employee",
        EmployeeId: 0,
      };
    case "MODAL_TITLE_EDIT_EMPLOYEE":
      return {
        ...state,
        modalTitle: "Update Employee",
        EmployeeId: action.payload.EmployeeId,
        ...action.payload.employee,
      };
    default:
      return state;
  }
};

export const EmpoyeePage = () => {
  useEffect(() => {
    getPosts();
    getPostDep();
  }, []);

  const generatePDF = (emp) => {
    console.log("Generating PDF for employee:", emp);

    const doc = new jsPDF();

    const container = document.createElement('div');

    createRoot(container).render(
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to Sai Photography</h1>
        <p>Dear {emp.EmployeeName},</p>
        <p>This is to inform you that you have successfully joined Sai Photography as {emp.Title}. Your attendance QR code is generated below. Please do not share it with anyone or engage in any malpractices, as consequences may follow.</p>
        <div>
          <QRCode
            value={` ${emp._id}`}
          />
        </div>
        <p>Employee ID: {emp.EmployeeId}</p>
        <p>Employee Name: {emp.EmployeeName}</p>
        <p>Email: {emp.email}</p>
        <p>Department: {emp.Department}</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p>Thank you for your cooperation.</p>
        <p>This QR code is for attendance purposes only. Do not share it for any malpractices.</p>
      </div>
    );

    setTimeout(() => {
      const qrCodeDataURL = container.querySelector('canvas').toDataURL();

      const img = new Image();
      img.src = qrCodeDataURL;
      img.onload = () => {
        doc.addImage(img, 'PNG', 10, 30, 50, 50);

        doc.text(`WELCOME TO BALA CINEMA `, 70, 20);
        doc.text(`Employee ID: ${emp.EmployeeId}`, 70, 30);
        doc.text(`Employee Name: ${emp.EmployeeName}`, 70, 40);
        doc.text(`Email: ${emp.email}`, 70, 50);
        doc.text(`Department: ${emp.Department}`, 70, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 70, 70);
        doc.text(`This QR code is for attendance purposes only. .`, 70, 80);
        doc.text(`Do not share it for any malpractices.`, 70, 90);

        doc.save(`Employee_${emp.EmployeeId}_QRCode.pdf`);
        console.log("Image added");
        const pdfData = doc.output('blob');

        const formData = new FormData();
        formData.append('pdf', pdfData, `Employee_${emp.EmployeeId}_QRCode.pdf`);
        formData.append('emp', JSON.stringify(emp));
      };
    }, 1000);
  };

  const [employee, setEmployee] = useState([]);
  const getPosts = () => {
    axios.get(API_URL.EMPLOYEE, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    }).then((res) => {
      setEmployee(res.data);
    });
  };

  const [department, setDepartment] = useState([]);
  const getPostDep = () => {
    axios.get(API_URL.DEPARTMENT, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    }).then((res) => {
      setDepartment(res.data);
    });
  };

  const [state, dispatch] = useReducer(reducer, {
    modalTitle: "",
    EmployeeId: 0,
    EmployeeName: "",
    Department: "",
    Date_of_Joining: "",
    PhotoFileName: "",
    photoPath: API_URL.photosPath,
    email: "",
    password: ""
  });

  const addClick = () => {
    dispatch({
      type: "MODAL_TITLE_ADD_EMPLOYEE",
    });
  };

  const editClick = (emp) => {
    dispatch({
      type: "MODAL_TITLE_EDIT_EMPLOYEE",
      payload: {
        EmployeeId: emp.EmployeeId,
        employee: emp,
      },
    });
  };

  const handleCreate = () => {
    const formData = new FormData();
    formData.append('EmployeeName', state.EmployeeName);
    formData.append('Department', state.Department);
    formData.append('Date_of_Joining', state.Date_of_Joining);
    formData.append('PhotoFileName', state.PhotoFileName);
    formData.append('email', state.email);
    formData.append('password', state.password);

    axios.post(API_URL.EMPLOYEE, formData, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      alert("The Employee is successfully added!");
      window.location.reload();
    }).catch((err) => {
      console.error("err create employee = " + err);
      if (err.response) {
        alert(`Error while Creating Employee: ${err.response.data.message}`);
      } else if (err.request) {
        alert("Error sending request. Please try again later.");
      } else {
        alert("Unknown error. Please try again later.");
      }
    });
  };

  const imageUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(API_URL.PROFILEPHOTO, formData)
      .then((res) => {
        dispatch({
          type: "ADD_EMPLOYEE",
          payload: {
            field: "PhotoFileName",
            value: res.data.fileName,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Error while uploading image");
      });
  };

  const handleUpdate = (id) => {
    employee.map((emp) => {
      if (emp.EmployeeId === id) {
        axios.put(`${API_URL.EMPLOYEE}${emp._id}`, {
          EmployeeName: state.EmployeeName,
          Department: state.Department,
          Date_of_Joining: state.Date_of_Joining,
          PhotoFileName: state.PhotoFileName,
          email: state.email,
          password: state.password
        }, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }).then(
          (res) => {
            alert("You are Successfully Update Employee!");
            window.location.reload();
          },
          (err) => {
            alert(`Error while Updating the Employee! ,please try again ${err.response.data.message}`)
          }
        );
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete Employee?")) {
      axios.delete(`${API_URL.EMPLOYEE}${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      }).then(
        (res) => {
          alert("You are Successfully Delete Employee !");
          window.location.reload();
        },
        (err) => {
          alert(`Error While Deleting Employee,try again! ${err.response.data.message}`)
        }
      );
    }
  };

  return (
    <MDBContainer>
      <NavBar />
      <button
        type="button"
       
        onClick={addClick}
      >
        Add Employee
      </button>
      <MDBTable hover striped bordered align='middle'>
        <MDBTableHead dark>
          <tr>
            <th>EmployeeId</th>
            <th>EmployeeName</th>
            <th>profile photo</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>email</th>
            <th>password</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead >
        <MDBTableBody>
          {employee.map((emp) => (
            <tr key={emp._id}>
              <td data-title="ID">{emp.EmployeeId}</td>
              <td data-title="Employee Name">{emp.EmployeeName}</td>
              <td data-title="Profile photo"><img className="rounded-circle profileImage" src={state.photoPath + emp.PhotoFileName} alt="no image" /></td>
              <td data-title="Department">{emp.Department}</td>
              <td data-title="DOJ">{emp.Date_of_Joining}</td>
              <td data-title="email">{emp.email}</td>
              <td data-title="password">{emp.password}</td>
              <td data-title="Action">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => editClick(emp)}
                  className="btn btn-sm shadow-lg rounded-pill text-decoration-none"
                >
                  <span>
                    <i className="fa-solid fa-user-pen"></i>
                  </span>
                </button>
                <button
                  className="btn btn-sm shadow-lg  rounded-pill ms-2"
                  onClick={() => handleDelete(emp._id)}
                >
                  <span>
                    <i
                      className="fa-sharp fa-solid fa-trash"
                      style={{ fontSize: "12px" }}
                    ></i>
                  </span>
                </button>
                <button
                  className="btn btn-sm shadow-lg rounded-pill text-decoration-none"
                  onClick={() => generatePDF(emp)}
                >
                  <span>
                    <i
                      className="fas fa-file-pdf"
                      style={{ fontSize: "12px" }}
                    ></i>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h4 className="modal-title">{state.modalTitle}</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 w-50 bd-highlight">
                  <div className="input-group mb-3">
                    <span className="input-group-text">EmployeeName:</span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        dispatch({
                          type: "ADD_EMPLOYEE",
                          payload: {
                            field: "EmployeeName",
                            value: e.target.value,
                          },
                        })
                      }
                      value={state.EmployeeName}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Department:</span>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        dispatch({
                          type: "ADD_EMPLOYEE",
                          payload: {
                            field: "Department",
                            value: e.target.value,
                          },
                        })
                      }
                      value={state.Department}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Date of Joining:</span>
                    <input
                      type="date"
                      className="form-control"
                      value={state.Date_of_Joining}
                      onChange={(e) =>
                        dispatch({
                          type: "ADD_EMPLOYEE",
                          payload: {
                            field: "Date_of_Joining",
                            value: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="p-2 w-50 bd-highlight">
                  <img
                    width="250px"
                    height="250px"
                    alt=""
                    src={`${state.photoPath}${state.PhotoFileName}`}
                  />
                  <input className="m-2" type="file" onChange={imageUpload} />
                </div>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">EMAIL:</span>
                <input
                  type="text"
                  className="form-control"
                  value={state.email}
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_EMPLOYEE",
                      payload: {
                        field: "email",
                        value: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">password:</span>
                <input
                  type="text"
                  className="form-control"
                  value={state.password}
                  onChange={(e) =>
                    dispatch({
                      type: "ADD_EMPLOYEE",
                      payload: {
                        field: "password",
                        value: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            {state.EmployeeId !== 0 ? (
              <button
                type="button"
                className=" btn btn-primary float-start"
                onClick={() => handleUpdate(state.EmployeeId)}
              >
                {" "}
                Update
              </button>
            ) : null}
            {state.EmployeeId === 0 ? (
              <button
                type="button"
                className=" btn btn-primary float-start"
                onClick={handleCreate}
              >
                {" "}
                Create
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </MDBContainer>
  );
};
