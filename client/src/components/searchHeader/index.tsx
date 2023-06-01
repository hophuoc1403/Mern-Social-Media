import {forwardRef, Ref, useState, ReactElement, ChangeEvent, useEffect} from 'react';
import {
  Link,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  lighten,
  List,
  ListItem,
  TextField,
  Theme,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  CircularProgress
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {TransitionProps} from '@mui/material/transitions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import {useDebounce} from "usehooks-ts";
import {useNavigate} from "react-router-dom";
import {searchPost} from "../../service/post.service";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
  () => `
  
    .MuiDialog-container {
    // background-color:#151521!important;
        height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
        max-height: calc(100vh - 64px)
        background-color:#151521!important;
    }
`
);

const SearchInputWrapper = styled(TextField)(
  ({theme}) => `
background-color:#151521!important;
    .MuiInputBase-input {
    background-color:#151521!important;
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

const DialogTitleWrapper = styled(DialogTitle)(
  ({theme}) => `
  background-color:#20344c!important;
    padding: ${theme.spacing(3)}
`
);

function HeaderSearch() {
  const [openSearchResults, setOpenSearchResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 1000)
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(false)
  const [products,setProducts] = useState<IPost[]>([])

  const handleSearchProduct = async (name:string) => {
    const res =( await searchPost(name)).posts
    setProducts(res)
  }

  useEffect(() => {
    setIsSearching(false)
    // eslint-disable-next-line no-unused-expressions
    debouncedSearch !== '' && handleSearchProduct(debouncedSearch)
  }, [debouncedSearch])




  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsSearching(true)
    setSearchValue(event.target.value);

    if (event.target.value) {
      if (!openSearchResults) {
        setOpenSearchResults(true);
      }
    } else {
      setOpenSearchResults(false);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchValue('')
  };

  const handleGoToAllResults = async () => {
    navigate(`/search?q=${searchValue}`)
      setOpen(false);
      setSearchValue('')
  }

  return (
    <>
      <Tooltip arrow title="Search">
        <IconButton color="primary" onClick={handleClickOpen}>
          <SearchTwoToneIcon/>
        </IconButton>
      </Tooltip>

      <DialogWrapper
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleClose}
      >
        <DialogTitleWrapper>
          <SearchInputWrapper
            value={searchValue}
            autoFocus={true}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{width: "40px"}}>{isSearching ? <CircularProgress size={22}/> : <SearchTwoToneIcon/>}</Box>
                </InputAdornment>
              )
            }}
            onKeyDown={ (e) => {
              if (e.key === "Enter") {
                setOpen(false)
                handleGoToAllResults()
              }
            }}
            placeholder="Search terms here..."
            fullWidth
            label="Search"
          />
        </DialogTitleWrapper>
        <Divider/>

        {openSearchResults && debouncedSearch !== '' && (
          <DialogContent sx={{bgcolor:"#151521"}}>
            <Box
              sx={{pt: 0, pb: 1}}
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="body2" component="span">
                Search results for{' '}
                <Typography
                  sx={{fontWeight: 'bold'}}
                  variant="body1"
                  component="span"
                >
                  {searchValue}
                </Typography>
              </Typography>
              <Link href="#" variant="body2" underline="hover">
                Advanced search
              </Link>
            </Box>
            <Divider sx={{my: 1}}/>
            <List disablePadding>
              {!isSearching && products.map((item, index) => (
                <>{index <= 5 &&
                    <ListItem onClick={() => {
                      setOpen(false)
                      navigate(`/post/${item.id}`)
                    }} key={item.id}
                    >
                        <Box flex="1">
                            <Box display="flex" justifyContent="space-between">
                                <Link
                                    href="#"
                                    underline="hover"
                                    sx={{fontWeight: 'bold'}}
                                    variant="body2"
                                >
                                  {item.post.description}
                                </Link>
                            </Box>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: (theme: Theme) =>
                                    lighten(theme.palette.secondary.main, 0.5)
                                }}
                            >
                              {item.user.firstName}
                            </Typography>
                        </Box>
                        <ChevronRightTwoToneIcon/>
                    </ListItem>}</>
              ))}
            </List>
            <Box sx={{textAlign: 'center'}}>
              {products.length > 0 && <Button color="primary" onClick={handleGoToAllResults}>View all search results</Button>}
            </Box>
          </DialogContent>
        )}
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;
