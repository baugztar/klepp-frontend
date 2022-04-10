import {
  DeleteOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined"
import {
  Alert,
  Card,
  CardContent,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_CONFIG } from "../config/api_config"
import useAuth from "../contexts/AuthContextProvider"
import { KleppVideoFile, KleppVideoPatch } from "../models/KleppVideoModels"
import kleppVideoService from "../services/kleppvideoservice"
import KleppVideoPlayer from "./KleppVideoPlayer"

interface KleppVideoCardProps {
  datetime: string
  file: KleppVideoFile
  username?: string
  canDelete: boolean
  onDelete: (fileName: string) => void
  overrideHidden: boolean
}

interface KleppVideoDeleteResponse {
  data: {
    fileName: string
  }
}

function KleppVideoCard(props: KleppVideoCardProps) {
  const [open, setOpen] = useState(false)
  const [alertText, setAlertText] = useState("")
  const [isHidden, setIsHidden] = useState(props.file.hidden)
  const [likes, setLikes] = useState(props.file.likes)

  const navigate = useNavigate()

  const { accessToken } = useAuth()

  function getVisibilityString(hidden: boolean) {
    return hidden ? "Vis video" : "Skjul video"
  }

  function copyToClipboard(uri: string) {
    navigator.clipboard
      .writeText(uri)
      .then(() => {
        setAlertText("Copied to clipboard!")
      })
      .catch(() => {
        setAlertText("Kunne ikke kopiere")
      })
      .finally(() => {
        openAlertClicked()
      })
  }

  function deleteItem(file: string) {
    if (accessToken != null) {
      kleppVideoService
        .delete<any, KleppVideoDeleteResponse>(file, accessToken)
        .then(data => {
          props.onDelete(data.data.fileName)
          setAlertText("File deleted!")
        })
        .catch(() => {
          setAlertText("Could not delete file")
        })
        .finally(() => {
          openAlertClicked()
        })
    } else {
      setAlertText("Could not delete file, try again")
      openAlertClicked()
    }
  }

  function toggleItemVisibility(isVisible: boolean, path: string) {
    if (accessToken != null) {
      const attrs: KleppVideoPatch = {
        path: path,
        hidden: !isVisible,
      }

      kleppVideoService
        .updateVideoAttrs(accessToken, attrs)
        .then(data => {
          setIsHidden(data.data.hidden)
        })
        .catch(err => {
          setAlertText("Could not update visibility")
          openAlertClicked()
        })
        .finally(() => {})
    }
  }

  function likeItem(path: string) {
    if (accessToken != null) {
      kleppVideoService
        .like(path, accessToken)
        .then(data => {
          setLikes(data.data.likes)
        })
        .catch(err => {
          setAlertText("Could not like video")
          openAlertClicked()
        })
    } else {
      setAlertText("Log in to like video")
      openAlertClicked()
    }
  }

  function dislikeItem(path: string) {
    if (accessToken != null) {
      kleppVideoService
        .dislike(path, accessToken)
        .then(data => {
          setLikes(data.data.likes)
        })
        .catch(err => {
          setAlertText("Could not like video")
          openAlertClicked()
        })
    } else {
      setAlertText("Log in to like video")
      openAlertClicked()
    }
  }

  function openAlertClicked() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function likeCounter() {
    switch (likes.length) {
      case 0:
        return null
      default:
        return (
          <Typography variant='subtitle1' color='white' noWrap>
            {likes.length}
          </Typography>
        )
    }
  }

  function tooltipLikes(shouldLike: boolean) {
    const numLikes = likes.length
    switch (true) {
      case numLikes == 0:
        if (shouldLike) {
          return "Like video"
        } else {
          return "Dislike video"
        }
      case numLikes <= 5:
        return likes.map(like => like.name).join(", ")
      case numLikes > 5:
        return likes
          .map(like => like.name)
          .slice(0, 5)
          .push("++")
      default:
        return ""
    }
  }

  async function openVideoClicked() {
    navigate(`video?uri=${props.file.uri}`)
  }

  function renderLike() {
    if (
      props.username &&
      likes.map(user => user.name).indexOf(props.username) !== -1
    ) {
      return (
        <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
          <Tooltip title={tooltipLikes(false)}>
            <FavoriteOutlinedIcon
              sx={{
                "&:hover": { cursor: "pointer", color: "#39796b" },
                mb: 1,
                color: "#ffffff",
              }}
              onClick={() => dislikeItem(props.file.path)}
            />
          </Tooltip>
          {likeCounter()}
        </Stack>
      )
    } else {
      return (
        <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
          <Tooltip title={tooltipLikes(true)}>
            <FavoriteBorderOutlined
              sx={{
                "&:hover": { cursor: "pointer", color: "#39796b" },
                mb: 1,
                color: "#ffffff",
              }}
              onClick={() => likeItem(props.file.path)}
            />
          </Tooltip>
          {likeCounter()}
        </Stack>
      )
    }
  }

  return (
    <Card square={true} elevation={2} key={props.datetime.toString()}>
      <KleppVideoPlayer
        embedUrl={props.file.uri}
        thumbnailUri={props.file.thumbnail_uri}
      />
      <CardContent
        sx={{ "&:last-child": { paddingBottom: "16px" }, paddingTop: 1 }}>
        <Stack direction='row' spacing={2} justifyContent='flex-end'>
          {props.canDelete && (
            <Tooltip title='Slett video'>
              <DeleteOutlined
                sx={{
                  "&:hover": { cursor: "pointer", color: "#39796b" },
                  mb: 1,
                  color: "#004d40",
                }}
                onClick={() => deleteItem(props.file.path)}
              />
            </Tooltip>
          )}
          {renderLike()}
          <Tooltip title='Del video'>
            <ShareOutlined
              sx={{
                "&:hover": { cursor: "pointer", color: "#39796b" },
                mb: 1,
                color: "#004d40",
              }}
              onClick={() =>
                copyToClipboard(
                  `${API_CONFIG.webBaseUrl}#/video?uri=${props.file.uri}`
                )
              }
            />
          </Tooltip>
          {!props.overrideHidden && (
            <Tooltip title={getVisibilityString(isHidden)}>
              {!isHidden ? (
                <VisibilityOff
                  sx={{
                    "&:hover": { cursor: "pointer", color: "#39796b" },
                    mb: 1,
                    color: "#004d40",
                  }}
                  onClick={() =>
                    toggleItemVisibility(isHidden, props.file.path)
                  }
                />
              ) : (
                <Visibility
                  sx={{
                    "&:hover": { cursor: "pointer", color: "#39796b" },
                    mb: 1,
                    color: "#004d40",
                  }}
                  onClick={() =>
                    toggleItemVisibility(isHidden, props.file.path)
                  }
                />
              )}
            </Tooltip>
          )}
        </Stack>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity='success'
            sx={{ width: "100%" }}>
            {alertText}
          </Alert>
        </Snackbar>
        <Typography
          variant='body1'
          color='white'
          sx={{
            "&:hover": { cursor: "pointer", color: "#39796b" },
            mb: 1,
            color: "#ffffff",
          }}
          noWrap
          onClick={() => openVideoClicked()}>
          {props.file.display_name}
        </Typography>
        <Typography variant='body2' color='white' sx={{ mt: 1 }}>
          {props.file.user.name}
        </Typography>
        <Typography variant='caption' color='white'>
          {props.datetime}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default KleppVideoCard
