
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: '2em'
    },
    rootTabela: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    }
}));


function analisarResposta(response) {

    if (!response.ok) {

        let mensagemErro = 'Houve um erro ao consultar o repositório.';

        if (response.status === 404) {
            mensagemErro = 'O repositório não foi localizado.';
        }

        throw new Error(mensagemErro);
    }
    return response.json();
}


function parseJsonResponse(jsonResponse) {
    return jsonResponse.map(row => {
        return {
            id: row.id,
            title: row.title,
            state: row.state,
            created_at: row.created_at
        }
    });
}


export default function App() {

    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [termoPesquisa, setTermoPesquisa] = useState('yahoo/kafka-manager');

    const consultarPullRequests = async e => {

        // limpa a lista de pull requests
        setRows([]);

        // aplica o termo da pesquisa no template de url para consulta de pull requests do git
        const url = `https://api.github.com/repos/${termoPesquisa}/pulls`;

        // inicia o indicador de pesquisa
        setLoading(true);

        // consulta os pull requests na API do github e renderiza na tabela
        fetch(url)
            .then(analisarResposta)
            .then(parseJsonResponse)
            .then(rows => {
                setLoading(false);
                setRows(rows);
            })
            .catch(erro => {
                setLoading(false);
                console.log(erro);
            });
    };

    const searchHandle = e => {
        setTermoPesquisa(e.target.value);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md" className={classes.wrapper}>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.root}>
                            <InputBase
                                className={classes.input}
                                placeholder="Caminho do repositório"
                                value={termoPesquisa}
                                onChange={searchHandle} />
                            <Fade unmountOnExit
                                in={loading}
                                style={{
                                    transitionDelay: loading ? '800ms' : '0ms'
                                }}>
                                <CircularProgress />
                            </Fade>
                            <IconButton className={classes.iconButton} aria-label="search" onClick={consultarPullRequests}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.rootTabela}>
                            <Table className={classes.table} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>State</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, i) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.title}
                                            </TableCell>
                                            <TableCell>{row.created_at}</TableCell>
                                            <TableCell>{row.state}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>

            </Container>
        </React.Fragment>
    );
}

