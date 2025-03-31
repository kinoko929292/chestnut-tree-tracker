import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import usePlantRecords from '../../hooks/usePlantRecords';
import { PlantRecord } from './types';

const PlantRecordList: React.FC = () => {
  const {
    plantRecords,
    loading,
    error,
    addPlantRecord,
    updatePlantRecord,
    removePlantRecord
  } = usePlantRecords();
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PlantRecord | null>(null);

  const handleAdd = () => {
    setCurrentRecord(null);
    setOpenForm(true);
  };

  const handleEdit = (record: PlantRecord) => {
    setCurrentRecord(record);
    setOpenForm(true);
  };

  const handleDeleteClick = (record: PlantRecord) => {
    setCurrentRecord(record);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    if (currentRecord) {
      removePlantRecord(currentRecord.id);
      setOpenDeleteDialog(false);
    }
  };

  const handleSubmit = (data: PlantRecord) => {
    if (currentRecord) {
      updatePlantRecord({ ...currentRecord, ...data });
    } else {
      addPlantRecord({
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    setOpenForm(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        データの読み込み中にエラーが発生しました: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          植え付け記録一覧
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAdd}
        >
          新規追加
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>作物種類</TableCell>
              <TableCell>植え付け日</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>畑エリア</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.plantType}</TableCell>
                <TableCell>{record.plantingDate.toLocaleDateString()}</TableCell>
                <TableCell>{record.quantity}</TableCell>
                <TableCell>{record.farmAreaId}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    aria-label="edit" 
                    color="primary"
                    onClick={() => handleEdit(record)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete" 
                    color="error"
                    onClick={() => handleDeleteClick(record)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TODO: PlantRecordFormを実装 */}
      {/* <PlantRecordForm
        open={openForm}
        initialData={currentRecord || undefined}
        onSubmit={handleSubmit}
        onClose={() => setOpenForm(false)}
      /> */}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>削除確認</DialogTitle>
        <DialogContent>
          <Typography>
            {currentRecord?.plantType}の記録を本当に削除しますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
          >
            キャンセル
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantRecordList;

// モジュールとして認識させるための宣言
export type PlantRecordListComponent = typeof PlantRecordList;