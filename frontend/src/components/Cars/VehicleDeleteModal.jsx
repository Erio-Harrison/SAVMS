import React, { useState, useMemo } from 'react';
import { Input, List, Checkbox, Button, Highlight } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import './VehicleDeleteModal.css';

export default function VehicleDeleteModal({ vehicles, onCancel, onDelete }) {
    const [searchText, setSearchText]         = useState('');
    const [selectedPlates, setSelectedPlates] = useState([]);

    const filtered = useMemo(
        () =>
            vehicles.filter(
                v =>
                    v.plate.toLowerCase().includes(searchText.toLowerCase()) ||
                    v.model.toLowerCase().includes(searchText.toLowerCase())
            ),
        [vehicles, searchText]
    );

    const toggle = plate =>
        setSelectedPlates(sel =>
            sel.includes(plate) ? sel.filter(x => x !== plate) : [...sel, plate]
        );

    return (
        <div className="vehicle-delete-modal">
            <Input
                prefix={<IconSearch />}
                placeholder="搜索车牌或车型"
                value={searchText}
                onChange={setSearchText}
                style={{ width: '100%', marginBottom: 12 }}
            />

            <List
                dataSource={filtered}
                renderItem={item => (
                    <div className="delete-item" key={item.plate}>
                        <Checkbox
                            checked={selectedPlates.includes(item.plate)}
                            onChange={() => toggle(item.plate)}
                        />
                        <div className="info">
                            <div className="plate">
                                <Highlight sourceString={item.plate} searchWords={[searchText]} />
                            </div>
                            <div className="model">
                                <Highlight sourceString={item.model} searchWords={[searchText]} />
                            </div>
                        </div>
                    </div>
                )}
            />

            <div className="actions">
                <Button onClick={onCancel} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
                <Button
                    theme="danger"
                    disabled={selectedPlates.length === 0}
                    onClick={() => onDelete(selectedPlates)}
                >
                    Delete {selectedPlates.length} Selected
                </Button>
            </div>
        </div>
    );
}
