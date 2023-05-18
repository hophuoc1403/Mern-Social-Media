import {useContext, useState} from 'react';

import {
  alpha,
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListSubheader,
  styled
} from '@mui/material';

import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {navigations} from './navigation';
import {useLocation, useNavigate} from "react-router-dom";
import {SidebarContext} from "../contexts/SideBarContext";

const MenuWrapper = styled(Box)(
  ({theme}) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};
    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: white;
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({theme}) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: blue;
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: white;
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: white;
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: white;
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color:#2b2b40;
            color: white;

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: white;
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: white;
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const {closeSidebar} = useContext(SidebarContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  const [open, setOpen] = useState<any>({});
  const handleClick = (key: any) => () => {
    console.log(key);
    setOpen((prevState: any) => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  return (
    <Box sx={{marginTop: 2}}>
      <MenuWrapper>
        {navigations.map((
          {
            subheader,
            key,
            label,
            icon: Icon,
            children
          }: { subheader: any, key: any, label: any, icon: any, children: any }) => {
          const isOpen = open[key] || false;
          return (
            <List
              key={key}
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {subheader}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem onClick={handleClick(key)}>
                    <Button
                      className={currentRoute === '="/' ? 'active' : ''}
                      disableRipple
                      component="a"
                      startIcon={Icon && <Icon/>}
                    >
                      {label}
                    </Button>
                  </ListItem>
                  {/*<Collapse in={isOpen} timeout="auto" unmountOnExit>*/}
                    <List
                      style={{padding: '3px 4px 0 8px'}}
                      component="div"
                      disablePadding
                    >
                      {children.map(
                        (
                          {
                            key: childKey,
                            label: childLabel,
                            icon: ChildIcon,
                            href: childHref,
                            children
                          }: {
                            key: any,
                            label: any,
                            icon: any,
                            href: any,
                            children: any
                          }) => {
                          const isOpen = open[childKey] || false;
                          return (
                            <>
                              <ListItem
                                onClick={handleClick(childKey)}
                                key={childKey}
                                sx={{pl: 4}}
                              >
                                <Button
                                  className={
                                    currentRoute === childHref ? 'active' : ''
                                  }
                                  disableRipple
                                  component="a"
                                  onClick={() => {
                                    if (childHref) {
                                      navigate(childHref);
                                      closeSidebar();
                                    }
                                  }}
                                  startIcon={ChildIcon && <ChildIcon/>}

                                >
                                  {childLabel}
                                </Button>
                              </ListItem>
                              {/*<Collapse*/}
                              {/*  in={false}*/}
                              {/*  timeout="auto"*/}
                              {/*  unmountOnExit*/}
                              {/*>*/}
                                <List
                                  style={{padding: '3px 4px 0 8px'}}
                                  component="div"
                                  disablePadding
                                >
                                  {children?.map(
                                    (
                                      {
                                        key: secondChildKey,
                                        label: secondChildLabel,
                                        icon: SecondChildIcon,
                                        href: secondHref
                                      }: {
                                        key: any,
                                        label: any,
                                        icon: any,
                                        href: any
                                      }) => (
                                      <>
                                        <ListItem
                                          onClick={handleClick(secondChildKey)}
                                          key={secondChildKey}
                                          sx={{pl: 4}}
                                        >
                                          <Button
                                            className={
                                              currentRoute === secondHref
                                                ? 'active'
                                                : ''
                                            }
                                            disableRipple
                                            component="a"
                                            onClick={() => {
                                              if (secondHref) {
                                                navigate(secondHref);
                                              }
                                              closeSidebar();
                                            }}
                                            startIcon={
                                              SecondChildIcon && (
                                                <SecondChildIcon/>
                                              )
                                            }
                                          >
                                            {secondChildLabel}
                                          </Button>
                                        </ListItem>
                                      </>
                                    )
                                  )}
                                </List>
                              {/*</Collapse>*/}
                            </>
                          );
                        }
                      )}
                    </List>
                  {/*</Collapse>*/}
                </List>
              </SubMenuWrapper>
            </List>
          );
        })}
      </MenuWrapper>
    </Box>
  );
}

export default SidebarMenu;
