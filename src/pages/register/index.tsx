// "use client"
// import * as React from "react"
// import { Typography, Box, Container, Paper, TextField, Button } from "@mui/material"
// import { useAuth, User } from "@/app/providers/AuthProvider"
// import { useNavigate } from "react-router"

// export default function RegisterPage() {
//     type PartialUser = Partial<User>

//     const [formData, setFormData] = React.useState<PartialUser>()
//     const [error, setError] = React.useState("")
//     const { login, loading } = useAuth()
//     const navigate = useNavigate()

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         try {
//             setError("")

//             // const response = await fetch("/api/auth/register",{
//             //     method:"POST",
//             //     headers:{
//             //         "Content-Type":"application/json"
//             //     },
//             //     body: JSON.stringify(formData)
//             // },

//             // )
//             // if(!response.ok){
//             //  setError("Ошибка")

//             // }

//             if (formData?.email && formData?.password) {
//                 const loginRes = await login(formData!.email, formData?.password)

//                 if (loginRes.success) {
//                     navigate("/")
//                 }
//             } else {
//                 setError("ошибка входа")
//             }
//         } catch (e) {
//             console.error(e)
//         }
//     }

//     return (
//         <Container component="main" maxWidth="xs">
//             <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
//                 <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
//                     Регистрация
//                 </Typography>

//                 <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
//                     <TextField
//                         variant="standard"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Имя"
//                         value={formData?.first_name}
//                         onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//                     />

//                     <TextField
//                         variant="standard"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Фамилия"
//                         value={formData?.last_name}
//                         onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//                     />

//                     <TextField
//                         variant="standard"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Орагнизация"
//                         value={formData?.organization}
//                         onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
//                     />

//                     <TextField
//                         variant="standard"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Email"
//                         type="email"
//                         value={formData?.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />

//                     <TextField
//                         variant="standard"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Пароль"
//                         type="password"
//                         value={formData?.password}
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     />

//                     <TextField
//                         variant="standard"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Подтвердите пароль"
//                         type="password"
//                         value={formData?.confirmPassword}
//                         onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                     />

//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         sx={{ mt: 3, mb: 2 }}
//                         // disabled={loading}
//                     >
//                         Зарегистрироваться
//                         {/* {loading ? "Регистрация..." : "Зарегистрироваться"} */}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Container>
//     )
// }

// import { FormStatus } from "@/app/providers/ModalFormProvider"

// export interface FormProps {
//     opened: boolean
//     close: () => void
//     setFormData: (next: FormData | ((prev: FormData) => FormData)) => void
//     formData: FormData
//     submitHandle?: (payload: FormData) => Promise<Response>
//     formStatus: FormStatus
//     checkForm?: (data: FormData) => Promise<boolean>
// }

// export interface FieldSetterProps {
//     setFormData: (next: FormData | ((prev: FormData) => FormData)) => void
//     formData: FormData
//     submitHandle: (payload: FormData) => Promise<Response>
//     formStatus: FormStatus
//     checkForm: (data: FormData) => Promise<boolean>
// }

// const baseStyle = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     bgcolor: "background.paper",
// }

// const styleDesktop = {
//     width: `720px`,
//     p: `3rem`,
// }

// const styleMd = {
//     width: `540px`,
//     height: `auto`,
//     p: `1.5rem`,
// }

// const styleMobile = {
//     width: `97%`,
//     height: `auto`,
//     maxHeight: `85%`,
//     p: `0.2rem`,
//     overflowY: `scroll`,
// }

// export function Registration({ close, formData, opened, setFormData, submitHandle, formStatus, checkForm }: FormProps) {

//     const theme = useTheme()

//     const breakpoint = [
//         useMediaQuery(theme.breakpoints.up("lg")),
//         useMediaQuery(theme.breakpoints.between("md", "lg")),
//         useMediaQuery(theme.breakpoints.between("sm", "md")),
//         useMediaQuery(theme.breakpoints.between("xs", "sm")),
//         useMediaQuery(theme.breakpoints.down("xs")),
//     ].indexOf(true)

//     const styles = [styleDesktop, styleDesktop, styleMd, styleMobile, styleMobile]

//     const current = Math.max(0, breakpoint + 1)
//     //   const { dict } = useI18n();
//     //   if (!dict || !dict.FeedbackForm) return null;
//     //   const { FeedbackForm } = dict;

//     return (
//         <>
//             <Modal
//                 aria-describedby="modal-submit-description"
//                 aria-labelledby="modal-submit-title"
//                 onClose={close}
//                 open={opened}
//             >
//                 <Fade in={opened}>
//                     <Card sx={{ ...baseStyle, ...styles[current] }}>
//                         <Stack direction={"row"} alignItems={"baseline"} justifyContent={"center"} m={current}>
//                             <Typography gutterBottom variant={current > 1 ? "h4" : "h6"} sx={{ userSelect: `none` }}>
//                                 {/* {FeedbackForm.Header.value} */}
//                             </Typography>
//                         </Stack>
//                         <Box>

//                         </Box>
//                     </Card>
//                 </Fade>
//             </Modal>
//             <Snackbar
//                 // open={snackbar.open}
//                 autoHideDuration={6000}
//                 // onClose={handleClose}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             >
//                 <Alert
//                     // onClose={handleClose}
//                     // severity={snackbar.severity}
//                     sx={{
//                         width: "100%",
//                         whiteSpace: "pre-line",
//                     }}
//                 >
//                     {/* {snackbar.message} */}
//                 </Alert>
//             </Snackbar>
//         </>
//     )
// }
