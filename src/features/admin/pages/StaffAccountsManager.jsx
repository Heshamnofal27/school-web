// import { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import IconButton from "@mui/material/IconButton";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import CircularProgress from "@mui/material/CircularProgress";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// import {
//   fetchAccountants,
//   addAccountantEmail,
//   deleteAccountant,
//   addSupervisorEmail,
//   deleteSupervisorByEmail,
// } from "../staffAccountsAPI";

// export default function StaffAccountsManager() {
//   const [tab, setTab] = useState("accountant");
//   const [email, setEmail] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState(null);

//   const [accountants, setAccountants] = useState([]);
//   const [loadingAccountants, setLoadingAccountants] = useState(true);

//   // قائمة المشرفين المضافين محلياً فقط لعرضها في هذه الجلسة (لا يوجد endpoint لقراءتهم من الخادم)
//   const [addedSupervisors, setAddedSupervisors] = useState([]);

//   const loadAccountants = async () => {
//     setLoadingAccountants(true);
//     const res = await fetchAccountants();
//     if (res.success) setAccountants(res.data);
//     setLoadingAccountants(false);
//   };

//   useEffect(() => {
//     loadAccountants();
//   }, []);

//   const handleAdd = async () => {
//     if (!email.trim()) return;
//     setSubmitting(true);

//     if (tab === "accountant") {
//       const res = await addAccountantEmail(email.trim());
//       if (res.success) {
//         setFeedback({ type: "success", message: res.message });
//         setEmail("");
//         loadAccountants();
//       } else {
//         setFeedback({ type: "error", message: res.message || "تعذر إضافة البريد" });
//       }
//     } else {
//       const res = await addSupervisorEmail(email.trim());
//       if (res.success) {
//         setFeedback({ type: "success", message: res.message });
//         setAddedSupervisors((list) => [...list, email.trim()]);
//         setEmail("");
//       } else {
//         setFeedback({ type: "error", message: res.message || "تعذر إضافة البريد" });
//       }
//     }
//     setSubmitting(false);
//   };

//   const handleDeleteAccountant = async (acc) => {
//     if (!window.confirm(`هل تريد حذف حساب المحاسب "${acc.name || acc.email}"؟`)) return;
//     const res = await deleteAccountant(acc.id);
//     if (res.success) {
//       setFeedback({ type: "success", message: res.message });
//       loadAccountants();
//     } else {
//       setFeedback({ type: "error", message: res.message || "تعذر الحذف" });
//     }
//   };

//   const handleDeleteSupervisor = async (supervisorEmail) => {
//     if (!window.confirm(`هل تريد حذف بريد المشرف "${supervisorEmail}"؟`)) return;
//     const res = await deleteSupervisorByEmail(supervisorEmail);
//     if (res.success) {
//       setFeedback({ type: "success", message: res.message });
//       setAddedSupervisors((list) => list.filter((e) => e !== supervisorEmail));
//     } else {
//       setFeedback({ type: "error", message: res.message || "تعذر الحذف" });
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 2 }}>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
//         <PersonAddAlt1Icon color="primary" />
//         <Box>
//           <Typography variant="h5" fontWeight={800}>
//             حسابات المشرفين والمحاسبين
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             إضافة بريد إلكتروني مصرّح به لإنشاء حساب مشرف أو محاسب جديد
//           </Typography>
//         </Box>
//       </Box>

//       <Paper variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
//         <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
//           <Tab value="accountant" label="المحاسبون" />
//           <Tab value="supervisor" label="المشرفون" />
//         </Tabs>

//         <Box sx={{ p: 3, display: "flex", gap: 1 }}>
//           <TextField
//             fullWidth
//             type="email"
//             label="البريد الإلكتروني"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button variant="contained" onClick={handleAdd} disabled={submitting || !email.trim()} sx={{ minWidth: 120 }}>
//             {submitting ? <CircularProgress size={20} /> : "إضافة"}
//           </Button>
//         </Box>

//         {tab === "supervisor" && (
//           <Box sx={{ px: 3, pb: 2, display: "flex", alignItems: "flex-start", gap: 1 }}>
//             <InfoOutlinedIcon fontSize="small" color="info" sx={{ mt: 0.3 }} />
//             <Typography variant="caption" color="text.secondary">
//               لا يوفر الخادم حالياً واجهة لعرض كل المشرفين المسجّلين، لذلك يظهر أدناه فقط ما
//               أضفته خلال هذه الجلسة. جميع عمليات الإضافة/الحذف تُنفَّذ فعلياً على الخادم.
//             </Typography>
//           </Box>
//         )}

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 700 }}>الاسم</TableCell>
//                 <TableCell sx={{ fontWeight: 700 }}>البريد الإلكتروني</TableCell>
//                 <TableCell sx={{ fontWeight: 700 }} align="center">
//                   إجراءات
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tab === "accountant" && loadingAccountants && (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
//                     <CircularProgress size={28} />
//                   </TableCell>
//                 </TableRow>
//               )}
//               {tab === "accountant" &&
//                 !loadingAccountants &&
//                 accountants.map((acc) => (
//                   <TableRow key={acc.id} hover>
//                     <TableCell>{acc.name || "-"}</TableCell>
//                     <TableCell>{acc.email}</TableCell>
//                     <TableCell align="center">
//                       <IconButton size="small" color="error" onClick={() => handleDeleteAccountant(acc)}>
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               {tab === "accountant" && !loadingAccountants && accountants.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
//                     <Typography color="text.secondary">لا يوجد محاسبون بعد</Typography>
//                   </TableCell>
//                 </TableRow>
//               )}

//               {tab === "supervisor" &&
//                 addedSupervisors.map((sEmail) => (
//                   <TableRow key={sEmail} hover>
//                     <TableCell>-</TableCell>
//                     <TableCell>{sEmail}</TableCell>
//                     <TableCell align="center">
//                       <IconButton size="small" color="error" onClick={() => handleDeleteSupervisor(sEmail)}>
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               {tab === "supervisor" && addedSupervisors.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
//                     <Typography color="text.secondary">لم تتم إضافة أي مشرف في هذه الجلسة بعد</Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       <Snackbar
//         open={!!feedback}
//         autoHideDuration={4000}
//         onClose={() => setFeedback(null)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         {feedback && (
//           <Alert severity={feedback.type} onClose={() => setFeedback(null)} variant="filled">
//             {feedback.message}
//           </Alert>
//         )}
//       </Snackbar>
//     </Container>
//   );
// }
