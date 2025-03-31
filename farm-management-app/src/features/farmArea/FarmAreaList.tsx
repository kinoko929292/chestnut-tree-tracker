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
import FarmAreaForm from './FarmAreaForm';
import useFarmAreas from '../../hooks/useFarmAreas';
import { FarmArea, FarmAreaInput } from './types';

const FarmAreaList: React.FC = () => {
  const {
    farmAreas,
    loading,
    error,
    addFarmArea,
    updateFarmArea,
    removeFarmArea
  } = useFarmAreas();
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentArea, setCurrentArea] = useState<FarmArea | null>(null);

  const handleAdd = () => {
    setCurrentArea(null);
    setOpenForm(true);
  };

  const handleEdit = (area: FarmArea) => {
    setCurrentArea(area);
    setOpenForm(true);
  };

  const handleDeleteClick = (area: FarmArea) => {
    setCurrentArea(area);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    if (currentArea) {
      removeFarmArea(currentArea.id);
      setOpenDeleteDialog(false);
    }
  };

  const handleSubmit = (data: FarmAreaInput) => {
    if (currentArea) {
      updateFarmArea({ ...currentArea, ...data });
    } else {
      addFarmArea({
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
          畑エリア一覧
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
              <TableCell width="80px">画像</TableCell>
              <TableCell>名前</TableCell>
              <TableCell align="right">面積 (㎡)</TableCell>
              <TableCell>場所</TableCell>
              <TableCell>メモ</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {farmAreas.map((area) => (
              <TableRow key={area.id}>
                <TableCell>
                  {area.imageUrl && (
                    <Avatar src={area.imageUrl} sx={{ width: 50, height: 50 }} />
                  )}
                </TableCell>
                <TableCell>{area.name}</TableCell>
                <TableCell align="right">{area.size}</TableCell>
                <TableCell>{area.location}</TableCell>
                <TableCell>{area.memo}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    aria-label="edit" 
                    color="primary"
                    onClick={() => handleEdit(area)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete" 
                    color="error"
                    onClick={() => handleDeleteClick(area)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FarmAreaForm
        open={openForm}
        initialData={currentArea || undefined}
        onSubmit={handleSubmit}
        onClose={() => setOpenForm(false)}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>削除確認</DialogTitle>
        <DialogContent>
          <Typography>
            {currentArea?.name}を本当に削除しますか？
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

export default FarmAreaList;

// モジュールとして認識させるための空エクスポート
export {}