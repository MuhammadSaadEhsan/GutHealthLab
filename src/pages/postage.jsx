// import React, { useEffect, useState, useCallback } from "react";
// import { message, Modal } from "antd";
// import BarcodeScannerInput from "../Components/BarcodeScannerInput";

// function Postage() {
//   const [kitId, setKitId] = useState("");
//   const [kitType, setKitType] = useState("");
//   const [kittypecon, setkittypecon] = useState("");
//   const [assignedto, setAssignedto] = useState("");
//   const [kitPrice, setKitPrice] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("Unpaid");
//   const [portalId] = useState("67c17d743394a458c944eec2");
//   const [practitioners, setPractitioners] = useState([]);
//   const [kitEntries, setKitEntries] = useState([]);
//   const [allkittypes, setAllKitTypes] = useState([]);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [existingKit, setExistingKit] = useState(null);

//   // Fetch practitioners
//   const fetchPractitioners = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/getallpractitionersforaddkit?portalid=67c17d743394a458c944eec2&id=6548f3f51f9aca26d81e0aea`
//       );
//       const data = await res.json();
//       if (Array.isArray(data.data)) setPractitioners(data.data);
//       else message.warning("Could not load practitioner list");
//     } catch (err) {
//       console.error("Error fetching practitioners:", err);
//       message.error("Failed to load practitioners");
//     }
//   };

//   // Fetch kit types
//   const fetchKittypes = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/getallkittypes?portalid=67c17d743394a458c944eec2`
//       );
//       const data = await res.json();
//       if (Array.isArray(data.kitTypes)) setAllKitTypes(data.kitTypes);
//       else message.warning("Could not load kit types");
//     } catch (err) {
//       console.error("Error fetching kit types:", err);
//       message.error("Failed to load kit types");
//     }
//   };

//   useEffect(() => {
//     fetchPractitioners();
//     fetchKittypes();
//   }, []);

//   const validateForm = useCallback(() => {
//     return kitId && kitType && assignedto && kitPrice && paymentStatus;
//   }, [kitId, kitType, assignedto, kitPrice, paymentStatus]);

//   // ✅ Check existing kit before adding
//   const addToTable = async () => {
//     if (!validateForm()) {
//       message.error("Please fill all fields before adding");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/check-existing-kit?kitId=${kitId}`
//       );
//       const data = await res.json();

//       if (data.status === 1) {
//         // Kit already exists → open modal
//         setExistingKit(data.data);
//         setShowModal(true);
//       } else {
//         // Kit not found → add normally
//         handleAddNewEntry();
//       }
//     } catch (err) {
//       console.error("Error checking kit:", err);
//       message.error("Error while checking kit existence");
//     }
//   };

//   // Adds a new entry
//   const handleAddNewEntry = () => {
//     const newEntry = {
//       id: Date.now(),
//       kitId,
//       kitType,
//       assignedto,
//       kitPrice: `€ ${kitPrice}`,
//       paymentStatus,
//       portalId,
//     };
//     setKitEntries((prev) => [...prev, newEntry]);
//     resetForm();
//     message.success("Kit added successfully!");
//   };

//   // Modal → Update existing kit
//   const handleUpdateExisting = () => {
//     handleAddNewEntry();
//     setShowModal(false);
//     setExistingKit(null);
//   };

//   // Modal → Close
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setExistingKit(null);
//     resetForm();
//   };

//   const resetForm = () => {
//     setKitId("");
//     setKitType("");
//     setAssignedto("");
//     setKitPrice("");
//     setPaymentStatus("Unpaid");
//   };

//   const removeEntry = (id) => {
//     setKitEntries((prev) => prev.filter((e) => e.id !== id));
//   };

//   // Send all kits
//   const sendAllData = async () => {
//     if (kitEntries.length === 0) {
//       message.error("No kits to send");
//       return;
//     }

//     const payload = {
//       kits: kitEntries.map((entry) => ({
//         kitId: entry.kitId,
//         kitType: entry.kitType,
//         assignedto: entry.assignedto,
//         kitPrice: entry.kitPrice.replace(/[€ ]/g, ""),
//         portalId: entry.portalId,
//         paymentStatus: entry.paymentStatus === "Paid" ? "fdgbhjbdgfhjdfgsbf" : "",
//         kittypecon: entry.kittypecon,
//       })),
//     };

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/save-kit-by-scan`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json().catch(() => ({}));
//       if (response.ok) {
//         message.success(result.message || "Kits processed successfully!");
//         setKitEntries([]);
//       } else {
//         message.error(result.message || "Failed to process kits");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       message.error("Server error while saving kits");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "900px", margin: "40px auto", textAlign: "center" }}>
//       <h1 style={{ color: "#0B233A", fontWeight: 700, marginBottom: 24 }}>Add Kit Form</h1>

//       <div style={{ textAlign: "left", background: "#f8fafc", padding: 24, borderRadius: 12 }}>
//         <BarcodeScannerInput
//           onDetected={(code) => setKitId(code)}
//           placeholder="Type Kit ID"
//           value={kitId}
//           className="barcode-input"
//         />

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//             gap: 12,
//             marginTop: 20,
//           }}
//         >
//           {/* Payment Type */}
//           <select
//             value={kittypecon}
//             onChange={(e) => setkittypecon(e.target.value)}
//             style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
//           >
//             <option value="">Select payment type</option>
//             <option value="Prepaid">Prepaid</option>
//             <option value="PrepaidInvoice">Prepaid Invoice</option>
//             <option value="RepaidRetail">Repaid Retail</option>
//           </select>

//           {/* Kit Type */}
//           <select
//             value={kitType}
//             onChange={(e) => setKitType(e.target.value)}
//             style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
//           >
//             <option value="">Select Kit Type</option>
//             {allkittypes.map((type, index) => (
//               <option key={index} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>

//           {/* Practitioner */}
//           <select
//             value={assignedto}
//             onChange={(e) => setAssignedto(e.target.value)}
//             style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
//           >
//             <option value="">Select Practitioner</option>
//             {practitioners.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.name} — {p.email}
//               </option>
//             ))}
//           </select>

//           {/* Kit Price */}
//           <input
//             type="number"
//             placeholder="€ Kit Price"
//             value={kitPrice}
//             onChange={(e) => setKitPrice(e.target.value)}
//             style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
//           />

//           {/* Payment Status */}
//           <select
//             value={paymentStatus}
//             onChange={(e) => setPaymentStatus(e.target.value)}
//             style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
//           >
//             <option value="Unpaid">Unpaid</option>
//             <option value="Paid">Paid</option>
//           </select>
//         </div>

//         <div style={{ display: "flex", gap: "12px", marginTop: 20, justifyContent: "center" }}>
//           <button
//             type="button"
//             onClick={addToTable}
//             disabled={!validateForm()}
//             style={{
//               background: validateForm() ? "#ccc" : "#ddd",
//               color: "#000",
//               border: "none",
//               padding: "10px 20px",
//               borderRadius: 6,
//               fontWeight: 600,
//             }}
//           >
//             Add to Table
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       {kitEntries.length > 0 && (
//         <div style={{ marginTop: 40, textAlign: "left" }}>
//           <h3 style={{ color: "#0B233A", marginBottom: 15 }}>
//             Kit Entries ({kitEntries.length})
//           </h3>

//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               background: "#fff",
//               borderRadius: 10,
//               overflow: "hidden",
//             }}
//           >
//             <thead style={{ background: "#0B233A", color: "#fff" }}>
//               <tr>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Kit ID</th>
//                 <th>Kit Type</th>
//                 <th>Practitioner</th>
//                 <th>Kit Price</th>
//                 <th>Payment Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {kitEntries.map((entry, i) => (
//                 <tr
//                   key={entry.id}
//                   style={{
//                     background: i % 2 === 0 ? "#f8f9fa" : "#fff",
//                     borderBottom: "1px solid #ddd",
//                   }}
//                 >
//                   <td style={{ padding: "12px" }}>{entry.kitId}</td>
//                   <td>{entry.kitType}</td>
//                   <td>{practitioners.find((p) => p._id === entry.assignedto)?.name}</td>
//                   <td>{entry.kitPrice}</td>
//                   <td>{entry.paymentStatus}</td>
//                   <td>
//                     <button
//                       type="button"
//                       onClick={() => removeEntry(entry.id)}
//                       style={{
//                         background: "#dc3545",
//                         color: "#fff",
//                         border: "none",
//                         padding: "6px 12px",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <button
//             type="button"
//             onClick={sendAllData}
//             style={{
//               width: "100%",
//               background: "#0B233A",
//               color: "#fff",
//               border: "none",
//               padding: "14px",
//               borderRadius: "6px",
//               marginTop: 24,
//               fontWeight: 700,
//               letterSpacing: "1px",
//             }}
//           >
//             SEND
//           </button>
//         </div>
//       )}

//       {/* 🔹 Existing Kit Modal */}
//       <Modal
//         title="Kit Already Exists"
//         open={showModal}
//         onCancel={handleCloseModal}
//         footer={null}
//       >
//         {existingKit ? (
//           <div>
//             <p><b>Kit ID:</b> {existingKit.kitid}</p>
//             <p><b>Type:</b> {existingKit.Kittype}</p>
//             <p><b>Assigned To:</b> {existingKit.assignedto || "N/A"}</p>
//             <p><b>Price:</b> {existingKit.Kitprice || "N/A"}</p>
//             <p><b>Status:</b> {existingKit.status || "N/A"}</p>
//           </div>
//         ) : (
//           <p>No data available</p>
//         )}

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
//           <button
//             onClick={handleCloseModal}
//             style={{
//               background: "#999",
//               color: "#fff",
//               border: "none",
//               padding: "8px 16px",
//               borderRadius: 4,
//             }}
//           >
//             Close
//           </button>
//           <button
//             onClick={handleUpdateExisting}
//             style={{
//               background: "#007bff",
//               color: "#fff",
//               border: "none",
//               padding: "8px 16px",
//               borderRadius: 4,
//             }}
//           >
//             Update
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default Postage;




import React, { useEffect, useState, useCallback } from "react";
import { message, Modal } from "antd";
import BarcodeScannerInput from "../Components/BarcodeScannerInput";

function Postage() {
  const [kitId, setKitId] = useState("");
  const [kitType, setKitType] = useState("");
  const [kittypecon, setkittypecon] = useState("");
  const [assignedto, setAssignedto] = useState("");
  const [kitPrice, setKitPrice] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [portalId] = useState("67c17d743394a458c944eec2");
  const [practitioners, setPractitioners] = useState([]);
  const [kitEntries, setKitEntries] = useState([]);
  const [allkittypes, setAllKitTypes] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [existingKit, setExistingKit] = useState(null);
  const [modalForm, setModalForm] = useState({
    kitid: "",
    Kittype: "",
    kittypecon: "",
    assignedto: "",
    Kitprice: "",
    status: "",
  });

  // Fetch practitioners
  const fetchPractitioners = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/getallpractitionersforaddkit?portalid=67c17d743394a458c944eec2&id=6548f3f51f9aca26d81e0aea`
      );
      const data = await res.json();
      if (Array.isArray(data.data)) setPractitioners(data.data);
      else message.warning("Could not load practitioner list");
    } catch (err) {
      console.error("Error fetching practitioners:", err);
      message.error("Failed to load practitioners");
    }
  };

  // Fetch kit types
  const fetchKittypes = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/getallkittypes?portalid=67c17d743394a458c944eec2`
      );
      const data = await res.json();
      if (Array.isArray(data.kitTypes)) setAllKitTypes(data.kitTypes);
      else message.warning("Could not load kit types");
    } catch (err) {
      console.error("Error fetching kit types:", err);
      message.error("Failed to load kit types");
    }
  };

  useEffect(() => {
    fetchPractitioners();
    fetchKittypes();
  }, []);

  const validateForm = useCallback(() => {
    return kitId;
    // return kitId && kitType && kitPrice && paymentStatus;
  }, [kitId]);

  // Check existing kit before adding
  const addToTable = async () => {
    if (!validateForm()) {
      message.error("Please fill all fields before adding");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/check-existing-kit?kitId=${kitId}`
      );
      const data = await res.json();

      if (data.status === 1) {
        // Kit exists — open editable modal
        setExistingKit(data.data);
        setModalForm({
          kitid: data.data.kitid,
          Kittype: data.data.Kittype,
          assignedto: data.data.assignedto || "",
          Kitprice: data.data.Kitprice2 || "",
        //   Kitprice2: data.data.Kitprice2 || "",
          status: data.data.status || "",
          kittypecon:data.data.kittypecon || "",
        });
        setShowModal(true);
      } else {
        // Add normally
        handleAddNewEntry();
      }
    } catch (err) {
      console.error("Error checking kit:", err);
      message.error("Error while checking kit existence");
    }
  };

  const handleAddNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      kitId,
      kitType,
      assignedto,
      kitPrice: `€ ${kitPrice}`,
      paymentStatus,
      portalId,
    };
    setKitEntries((prev) => [...prev, newEntry]);
    resetForm();
    message.success("Kit added successfully!");
  };

const handleUpdateExisting = () => {
  const updatedEntry = {
    id: Date.now(),
    kitId: modalForm.kitid,
    kitType: modalForm.Kittype,
    assignedto: modalForm.assignedto,
    kitPrice: `€ ${modalForm.Kitprice}`,
    paymentStatus,
    kittypecon: modalForm.kittypecon || "",   // ✅ fix here
    portalId,
  };

  setKitEntries((prev) => [...prev, updatedEntry]);
  setShowModal(false);
  setExistingKit(null);
  message.success("Updated kit added to table!");
};


  const handleCloseModal = () => {
    setShowModal(false);
    setExistingKit(null);
    resetForm();
  };

  const resetForm = () => {
    setKitId("");
    setKitType("");
    setAssignedto("");
    setKitPrice("");
    setPaymentStatus("Unpaid");
  };

  const removeEntry = (id) => {
    setKitEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const sendAllData = async () => {
    if (kitEntries.length === 0) {
      message.error("No kits to send");
      return;
    }

    const payload = {
      kits: kitEntries.map((entry) => ({
        kitId: entry.kitId,
        kitType: entry.kitType,
        assignedto: entry.assignedto,
        kitPrice: entry.kitPrice.replace(/[€ ]/g, ""),
        portalId: entry.portalId,
        paymentStatus: entry.paymentStatus === "Paid" ? "fdgbhjbdgfhjdfgsbf" : "",
        kittypecon: entry.kittypecon,
      })),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/save-kit-by-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        message.success(result.message || "Kits processed successfully!");
        setKitEntries([]);
      } else {
        message.error(result.message || "Failed to process kits");
      }
    } catch (err) {
      console.error("Error:", err);
      message.error("Server error while saving kits");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", textAlign: "center" }}>
      <h1 style={{ color: "#0B233A", fontWeight: 700, marginBottom: 24 }}>Add Kit Form</h1>

      <div style={{ textAlign: "left", background: "#f8fafc", padding: 24, borderRadius: 12 }}>
        <BarcodeScannerInput
          onDetected={(code) => setKitId(code)}
          placeholder="Type Kit ID"
          value={kitId}
          className="barcode-input"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 20,
          }}
        >
          <select
            value={kittypecon}
            onChange={(e) => setkittypecon(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select payment type</option>
            <option value="Prepaid">Prepaid</option>
            <option value="PrepaidInvoice">Prepaid Invoice</option>
            <option value="Consignment">Consignment</option>
          </select>

          <select
            value={kitType}
            onChange={(e) => setKitType(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select Kit Type</option>
            {allkittypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={assignedto}
            onChange={(e) => setAssignedto(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select Practitioner</option>
            {practitioners.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — {p.email}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="€ Kit Price"
            value={kitPrice}
            onChange={(e) => setKitPrice(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: 20, justifyContent: "center" }}>
          <button
            type="button"
            onClick={addToTable}
            disabled={!validateForm()}
            style={{
              background: validateForm() ? "#ccc" : "#ddd",
              color: "#000",
              border: "none",
              padding: "10px 20px",
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            Add to Table
          </button>
        </div>
      </div>

      {/* Table */}
      {kitEntries.length > 0 && (
        <div style={{ marginTop: 40, textAlign: "left" }}>
          <h3 style={{ color: "#0B233A", marginBottom: 15 }}>
            Kit Entries ({kitEntries.length})
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#0B233A", color: "#fff" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>Kit ID</th>
                <th>Kit Type</th>
                <th>Practitioner</th>
                <th>Kit Price</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kitEntries.map((entry, i) => (
                <tr
                  key={entry.id}
                  style={{
                    background: i % 2 === 0 ? "#f8f9fa" : "#fff",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: "12px" }}>{entry.kitId}</td>
                  <td>{entry.kitType}</td>
                  <td>{practitioners.find((p) => p._id === entry.assignedto)?.name}</td>
                  <td>{entry.kitPrice}</td>
                  <td>{entry.paymentStatus}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={sendAllData}
            style={{
              width: "100%",
              background: "#0B233A",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "6px",
              marginTop: 24,
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            SEND
          </button>
        </div>
      )}

      {/* Editable Modal */}
      {/* <Modal
        title="Kit Already Exists"
        open={showModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label>Kit ID</label>
          <input
            type="text"
            value={modalForm.kitid}
            onChange={(e) => setModalForm({ ...modalForm, kitid: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />

          <label>Kit Type</label>
          <select
            value={modalForm.Kittype}
            onChange={(e) => setModalForm({ ...modalForm, Kittype: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          >
            <option value="">Select Kit Type</option>
            {allkittypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label>Assigned To</label>
          <select
            value={modalForm.assignedto}
            onChange={(e) => setModalForm({ ...modalForm, assignedto: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          >
            <option value="">Select Practitioner</option>
            {practitioners.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — {p.email}
              </option>
            ))}
          </select>

          <label>Price</label>
          <input
            type="number"
            value={modalForm.Kitprice}
            onChange={(e) => setModalForm({ ...modalForm, Kitprice: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />

          <label>Status</label>
          <input
            type="text"
            value={modalForm.status}
            onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
          <button
            onClick={handleCloseModal}
            style={{
              background: "#999",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4,
            }}
          >
            Close
          </button>
          <button
            onClick={handleUpdateExisting}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4,
            }}
          >
            Update
          </button>
        </div>
      </Modal> */}

<Modal
  title="Kit Already Exists, Do you want to change?"
  open={showModal}
  onCancel={handleCloseModal}
  footer={null}
>
  <div
    style={{
      background: "#f8fafc",
      padding: 20,
      borderRadius: 12,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12,
    }}
  >
    {/* Kit ID */}
    <div style={{ gridColumn: "1 / -1" }}>
      <label style={{ fontWeight: 600, color: "#0B233A" }}>Kit ID</label>
      <input
        type="text"
        value={modalForm.kitid}
        onChange={(e) => setModalForm({ ...modalForm, kitid: e.target.value })}
        placeholder="Type Kit ID"
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      />
    </div>

    {/* Payment Type */}
    <select
      value={modalForm.kittypecon || ""}
      onChange={(e) => setModalForm({ ...modalForm, kittypecon: e.target.value })}
      style={{
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
      }}
    >
      <option value="">Select Payment Type</option>
      <option value="Prepaid">Prepaid</option>
      <option value="PrepaidInvoice">Prepaid Invoice</option>
      <option value="Consignment">Consignment</option>
    </select>

    {/* Kit Type */}
    <select
      value={modalForm.Kittype || ""}
      onChange={(e) => setModalForm({ ...modalForm, Kittype: e.target.value })}
      style={{
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
      }}
    >
      <option value="">Select Kit Type</option>
      {allkittypes.map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </select>

    {/* Practitioner */}
    <select
      value={modalForm.assignedto || ""}
      onChange={(e) => setModalForm({ ...modalForm, assignedto: e.target.value })}
      style={{
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
      }}
    >
      <option value="">Select Practitioner</option>
      {practitioners.map((p) => (
        <option key={p._id} value={p._id}>
          {p.name} — {p.email}
        </option>
      ))}
    </select>

    {/* Price */}
    <input
      type="number"
      value={modalForm.Kitprice || ""}
      onChange={(e) => setModalForm({ ...modalForm, Kitprice: e.target.value })}
      placeholder="€ Kit Price"
      style={{
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
      }}
    />

    {/* Payment Status */}
    {/* <select
      value={modalForm.Kitprice}
      onChange={(e) => setPaymentStatus(e.target.value)}
      style={{
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
      }}
    >
      <option value="Unpaid">Unpaid</option>
      <option value="Paid">Paid</option>
    </select> */}

    {/* Status Field */}
    {/* <div style={{ gridColumn: "1 / -1" }}>
      <input
        type="text"
        value={modalForm.status || ""}
        onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
        placeholder="Status"
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      />
    </div> */}
  </div>

  {/* Buttons */}
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
    <button
      onClick={handleCloseModal}
      style={{
        background: "#999",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: 4,
      }}
    >
      Close
    </button>
    <button
      onClick={handleUpdateExisting}
      style={{
        background: "#007bff",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: 4,
      }}
    >
      Update
    </button>
  </div>
</Modal>


    </div>
  );
}

export default Postage;
