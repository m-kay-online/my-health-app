import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from "../api";

const TestDepartment = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTest, setEditTest] = useState(null);
  const [newTest, setNewTest] = useState({
    test_name: "",
    department: "",
    cost: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // Fetch test data
  useEffect(() => {
    setLoading(true);
    api
      .get("/test-costs/costs")
      .then((response) => {
        setTests(response.data);
        setFilteredTests(response.data); // Initialize filtered tests
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching test data");
        setLoading(false);
        toast.error("Error fetching test data");
      });
  }, []);

  // Handle department filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setDepartmentFilter(filter);

    if (filter) {
      setFilteredTests(tests.filter((test) => test.department.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFilteredTests(tests); // Reset filter
    }
  };

  // Handle form submission for adding a new test
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/test-costs/costs", newTest)
      .then((response) => {
        setTests([...tests, response.data]);
        setFilteredTests([...filteredTests, response.data]);
        setShowForm(false);
        setNewTest({ test_name: "", department: "", cost: "" });
        setLoading(false);
        toast.success("Test added successfully!");
      })
      .catch((err) => {
        setError("Error adding test");
        setLoading(false);
        toast.error("Error adding test");
      });
  };

  // Handle form submission for editing a test
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .put(`test-costs/costs/${editTest.id}`, newTest)
      .then((response) => {
        setTests(tests.map((test) => (test.id === editTest.id ? response.data : test)));
        setFilteredTests(filteredTests.map((test) => (test.id === editTest.id ? response.data : test)));
        setShowForm(false);
        setEditTest(null);
        setNewTest({ test_name: "", department: "", cost: "" });
        setLoading(false);
        toast.success("Test updated successfully!");
      })
      .catch((err) => {
        setError("Error editing test");
        setLoading(false);
        toast.error("Error editing test");
      });
  };

  // Handle delete test
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    setLoading(true);
    api
      .delete(`test-costs/costs/${id}`)
      .then(() => {
        setTests(tests.filter((test) => test.id !== id));
        setFilteredTests(filteredTests.filter((test) => test.id !== id));
        setLoading(false);
        toast.success("Test deleted successfully!");
      })
      .catch((err) => {
        setError("Error deleting test");
        setLoading(false);
        toast.error("Error deleting test");
      });
  };

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Test Departments</h1>

      {loading && <div className="text-blue-500 mb-4">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filter by Department */}
      <div className="mb-8">
        <label className="block text-white font-medium mb-2">Filter by Department</label>
        <input
          type="text"
          value={departmentFilter}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter department to filter"
        />
      </div>

      <table className="table-auto w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Test Name</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Cost</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredTests) &&
            filteredTests.map((test, index) => (
              <tr key={test.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border px-4 py-2">{test.id}</td>
                <td className="border px-4 py-2">{test.test_name}</td>
                <td className="border px-4 py-2">{test.department}</td>
                <td className="border px-4 py-2">{test.cost}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setEditTest(test);
                      setNewTest({
                        test_name: test.test_name,
                        department: test.department,
                        cost: test.cost,
                      });
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          setShowForm(true);
          setEditTest(null);
          setNewTest({ test_name: "", department: "", cost: "" });
        }}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        New Test
      </button>

      {/* Form to Add/Edit Test */}
      {showForm && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-gray-700">{editTest ? "Edit Test" : "Add New Test"}</h2>
          <form onSubmit={editTest ? handleEditSubmit : handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">Test Name</label>
              <input
                type="text"
                value={newTest.test_name}
                onChange={(e) => setNewTest({ ...newTest, test_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter test name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">Department</label>
              <input
                type="text"
                value={newTest.department}
                onChange={(e) => setNewTest({ ...newTest, department: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter department name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">Cost</label>
              <input
                type="number"
                value={newTest.cost}
                onChange={(e) => setNewTest({ ...newTest, cost: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter test cost"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
              {editTest ? "Update Test" : "Add Test"}
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TestDepartment;