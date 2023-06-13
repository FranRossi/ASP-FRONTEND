import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Typography,
} from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

SaleListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onHandleFilterDate: PropTypes.func,
  onHandleClearDate: PropTypes.func,
};

export default function SaleListToolbar({
  filterName,
  onFilterName,
  onHandleFilterDate,
  onHandleClearDate,
}) {
  return (
    <StyledRoot>
      <StyledSearch
        value={filterName}
        onChange={onFilterName}
        placeholder="Search by client..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
      <Stack>
        <Tooltip title="Filter list">
          <IconButton onClick={onHandleFilterDate}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              Filter dates
            </Typography>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
        <IconButton onClick={onHandleClearDate}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            Clear dates
          </Typography>
        </IconButton>
      </Stack>
    </StyledRoot>
  );
}
