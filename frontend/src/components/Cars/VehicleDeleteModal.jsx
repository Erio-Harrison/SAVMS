import React, { useState, useEffect } from 'react';
import { Transfer, Checkbox, Avatar, Button, Toast, LocaleProvider } from '@douyinfe/semi-ui';
import { IconHandle, IconClose } from '@douyinfe/semi-icons';
import axiosInstance from '../../axiosInstance';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';  // ← 英文包


export default function VehicleDeleteModal({ vehicles, onCancel, onDelete, fetchCars }) {
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  useEffect(() => {
    if (fetchCars) fetchCars();
  }, [fetchCars]);

  // Transfer 要求的数据源格式
  const dataSource = vehicles.map(v => ({
    key: v.licensePlate,
    label: v.carModel,
    value: v.licensePlate,
    abbr: v.licensePlate[0],
    color: 'blue',
  }));

  // 左侧列表项渲染
  const renderSourceItem = item => (
    <div className="components-transfer-demo-source-item" key={item.value}>
      <Checkbox
        onChange={() => item.onChange()}
        checked={item.checked}
        style={{ height: 52, alignItems: 'center' }}
      >
        <Avatar color={item.color} size="small">
          {item.abbr}
        </Avatar>
        <div className="info">
          <div className="name">{item.label}</div>
          <div className="plate">{item.value}</div>
        </div>
      </Checkbox>
    </div>
  );

  // 右侧已选列表项渲染（支持拖拽和删除）
  const renderSelectedItem = item => {
    const { sortableHandle } = item;
    const DragHandle = sortableHandle(() => (
      <IconHandle className="semi-right-item-drag-handler" />
    ));
    return (
      <div className="components-transfer-demo-selected-item" key={item.value}>
        <DragHandle />
        <Avatar color={item.color} size="small">
          {item.abbr}
        </Avatar>
        <div className="info">
          <div className="name">{item.label}</div>
          <div className="plate">{item.value}</div>
        </div>
        <IconClose onClick={() => item.onRemove()} />
      </div>
    );
  };

  // 搜索过滤逻辑
  const customFilter = (input, item) =>
    item.label.includes(input) || item.value.includes(input);

  // Transfer 选中变化
  const handleChange = (values /* Array<string> */, items) => {
    setSelectedVehicles(values);
  };

  // 真正执行删除
  const handleConfirmDelete = async () => {
    if (!selectedVehicles.length) {
      Toast.warning('Please choose a vehicle');
      return;
    }
    try {
      const res = await axiosInstance.delete('/vehicles/delete/byPlate', {
        data: selectedVehicles,
      });
      Toast.success(res.data.msg);
      setSelectedVehicles([]);
      fetchCars && fetchCars();
      onDelete && onDelete();  // 如果父组件需要回调
    } catch (err) {
      console.error(err);
      Toast.error('Failed to delete Vehicle');
    }
  };

  return (
    <>
        <LocaleProvider locale={en_GB}>
      <Transfer
        draggable
        style={{ width: 600 }}
        dataSource={dataSource}
        filter={customFilter}
        inputProps={{ placeholder: 'Search Plate or Modal' }}
        renderSourceItem={renderSourceItem}
        renderSelectedItem={renderSelectedItem}
        value={selectedVehicles}
        onChange={handleChange}

          // 左侧头部：显示“Select all / Unselect all”
//           renderSourceHeader={({ num, allChecked, showButton, onAllClick }) => (
//             <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
//               <span>{num} items</span>
//               {showButton && (
//                 <a onClick={onAllClick}>
//                   {allChecked ? 'Unselect all' : 'Select all'}
//                 </a>
//               )}
//             </div>
//           )}
//           // 右侧头部：显示“X selected / Clear”
//           renderSelectedHeader={({ length, showButton, onClear }) => (
//             <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
//               <span>{length} selected</span>
//               {showButton && <a onClick={onClear}>Clear</a>}
//             </div>
//           )}
      />
          </LocaleProvider>






      <div style={{ textAlign: 'right', marginTop: 12 }}>
        <Button onClick={onCancel} style={{ marginRight: 12 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          theme="solid"
          onClick={handleConfirmDelete}
          disabled={!selectedVehicles.length}
        >
          Delete {selectedVehicles.length ? `(${selectedVehicles.length})` : ''}
        </Button>
      </div>


    </>
  );
}