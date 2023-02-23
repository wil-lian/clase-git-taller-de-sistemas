import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import FormCreate from "./FormCreate"
import FormDelete from "./FormDelete"
import FormUpdate from "./FormUpdate"

import {
  getService,
} from "../../service/index.service";
import {
  dataUser,
  typeRolData,
  typeSucursalData,
} from "../../interfaces/usuario";
import Color from "../../utils/styles/Color";
import { headerTable } from "../../utils/styles/General";
import { IComando } from "../../interfaces/grupo";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface Column {
  id: "nro" | "detalle" | "tipo" | "options";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nro", label: "Nro", minWidth: 50 },
  { id: "detalle", label: "Detalle", minWidth: 200 },
  { id: "tipo", label: "Tipo", minWidth: 100 },
  {
    id: "options",
    label: "Opciones",
    minWidth: 170,
  },
];

export default function Usuario() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataList, setDataList] = React.useState<IComando[]>([]);
  const [dataTotal, setDataTotal] = React.useState<number>(0);

  let navigate = useNavigate();
  React.useEffect(() => {
    getList()
  }, []);

  const getList = ({ pagina = 0, limite = 10 }: { pagina?: number; limite?: number } = {}) => {
    getService(`/comando/list`, {}).then((result) => {
      if (result.success) {
        const userList = result.data as IComando[];
        userList.forEach((user, i) => {
          user.NRO = i + 1;
        });
        setDataList(userList);
        setDataTotal(result.total || 0);
      }
    }).catch(()=>{
      console.error("error de carga de usuario")
    });
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getList({ pagina: newPage })
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    getList({ limite: +event.target.value })
    setPage(0);
  };

  return (
    <>
      <Typography variant="h4" component="h4">
        ADMINISTRACIÓN DE USUARIOS
      </Typography>
      
      <Grid container component="main" justifyContent={'flex-end'} >
        <FormCreate getList={getList} />
      </Grid>
      <Box sx={{ width: '100%' }} style={{display:dataList.length==0?'block':'none'}}>
        <LinearProgress />
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, ...headerTable }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.NRO}>
                      <TableCell>{row.NRO}</TableCell>
                      <TableCell>{row.detalle}</TableCell>
                      <TableCell>{row.tipo}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <FormDelete usuario={row} getList={getList} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={dataTotal}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
              />
      </Paper>
    </>
  );
}
