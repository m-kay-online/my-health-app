const TestMaster = () => {
  const tests = [
    // Replace with API call
    {
      patientId: 1,
      name: "John Doe",
      test: "Blood Test",
      cost: 500,
      paid: false,
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Test Master</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Patient ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Test</th>
            <th className="py-2 px-4 border">Cost</th>
            <th className="py-2 px-4 border">Paid</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{test.patientId}</td>
              <td className="py-2 px-4 border">{test.name}</td>
              <td className="py-2 px-4 border">{test.test}</td>
              <td className="py-2 px-4 border">{test.cost}</td>
              <td className="py-2 px-4 border">{test.paid ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestMaster;