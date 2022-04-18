import "./App.css"
import Header from "./components/Header"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./styles/theme"
import KleppVideoGrid from "./components/KleppVideoGrid"
import KleppFrontPage from "./components/KleppFrontPage"
import { Amplify as Amplify } from "aws-amplify"
import "@aws-amplify/ui-react/styles.css"
import { AMPLIFY_CONFIG } from "./config/amplify_config"
import { Routes, Route, HashRouter } from "react-router-dom"
import { FRONTPAGE_TEXT } from "./enums/AppTextTypes"
import Login from "./components/Login"
import UploadFile from "./components/UploadFile"
import KleppVideoPreview from "./components/KleppVideoPreview"
import { Container } from "@mui/material"
import { SnackbarProvider } from "notistack"

Amplify.configure(AMPLIFY_CONFIG)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <HashRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/login' element={<Login />} />
            <Route path='/upload' element={<UploadFile />} />
            <Route path='/video' element={<KleppVideoPreview />} />
          </Routes>
        </HashRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

function Main() {
  return (
    <div className='App'>
      <Header />
      <KleppFrontPage
        logo='assets/kleppwhite.png'
        title={FRONTPAGE_TEXT.TITLE}
        subtitle={FRONTPAGE_TEXT.SUBTITLE}
      />
      <Container maxWidth='xl'>
        <KleppVideoGrid />
      </Container>
    </div>
  )
}

export default App
