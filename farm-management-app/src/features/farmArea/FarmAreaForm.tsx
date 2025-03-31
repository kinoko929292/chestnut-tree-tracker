import React from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  IconButton
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { FarmAreaInput } from './types';

interface FarmAreaFormProps {
  open: boolean;
  initialData?: FarmAreaInput;
  onSubmit: (data: FarmAreaInput) => void;
  onClose: () => void;
}

const FarmAreaForm: React.FC<FarmAreaFormProps> = ({ 
  open, 
  initialData, 
  onSubmit, 
  onClose 
}) => {
  const [formData, setFormData] = React.useState<FarmAreaInput>({
    name: initialData?.name || '',
    size: initialData?.size || 0,
    location: initialData?.location || '',
    memo: initialData?.memo || '',
    imageUrl: initialData?.imageUrl || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          imageUrl: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        size: 0,
        location: '',
        memo: '',
        imageUrl: ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? '畑エリア編集' : '新規畑エリア追加'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <label htmlFor="image-upload">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              {formData.imageUrl ? (
                <Avatar
                  src={formData.imageUrl}
                  sx={{ width: 100, height: 100, cursor: 'pointer' }}
                />
              ) : (
                <IconButton component="span" color="primary">
                  <AddPhotoAlternateIcon sx={{ fontSize: 60 }} />
                </IconButton>
              )}
            </label>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 1 }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <TextField
                fullWidth
                label="名前"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <TextField
                fullWidth
                label="面積 (㎡)"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="場所"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="メモ"
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            キャンセル
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {initialData ? '更新' : '登録'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FarmAreaForm;

// モジュールとして認識させるための空エクスポート
export {}