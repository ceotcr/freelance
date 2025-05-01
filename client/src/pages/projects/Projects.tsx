import { Button, Typography, Card, Input, Select, DatePicker, Row, Col, Space } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import ProjectsList from "../../components/projects/ProjectList";
import { useAuthStore } from "../../store/auth.store";
import { useReducer } from "react";

const { Title } = Typography;
const { Option } = Select;

interface ProjectsState {
    pagination: {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: 'ASC' | 'DESC';
    };
    filters: {
        search?: string;
        status?: string;
        minBudget?: number;
        maxBudget?: number;
    };
}

type ProjectsAction =
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_LIMIT'; payload: number }
    | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: 'ASC' | 'DESC' } }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SET_STATUS'; payload: string }
    | { type: 'SET_BUDGET_RANGE'; payload: { min?: number; max?: number } }
    | { type: 'RESET_FILTERS' };

// Reducer function
function projectsReducer(state: ProjectsState, action: ProjectsAction): ProjectsState {
    switch (action.type) {
        case 'SET_PAGE':
            return { ...state, pagination: { ...state.pagination, page: action.payload } };
        case 'SET_LIMIT':
            return { ...state, pagination: { ...state.pagination, limit: action.payload } };
        case 'SET_SORT':
            return { ...state, pagination: { ...state.pagination, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder } };
        case 'SET_SEARCH':
            return { ...state, filters: { ...state.filters, search: action.payload } };
        case 'SET_STATUS':
            return { ...state, filters: { ...state.filters, status: action.payload } };
        case 'SET_BUDGET_RANGE':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    minBudget: action.payload.min,
                    maxBudget: action.payload.max
                }
            };
        case 'RESET_FILTERS':
            return {
                ...state,
                filters: {
                    search: undefined,
                    status: undefined,
                    minBudget: undefined,
                    maxBudget: undefined,
                },
                pagination: {
                    ...state.pagination,
                    page: 1
                }
            };
        default:
            return state;
    }
}

// Initial state
const initialState: ProjectsState = {
    pagination: {
        page: 1,
        limit: 9,
        sortBy: 'postedAt',
        sortOrder: 'DESC'
    },
    filters: {}
};

export default function ProjectsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [state, dispatch] = useReducer(projectsReducer, initialState);

    const handleSearch = (value: string) => {
        dispatch({ type: 'SET_SEARCH', payload: value });
        dispatch({ type: 'SET_PAGE', payload: 1 });
    };

    const handleStatusChange = (value: string) => {
        dispatch({ type: 'SET_STATUS', payload: value });
        dispatch({ type: 'SET_PAGE', payload: 1 });
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('_') as [string, 'ASC' | 'DESC'];
        dispatch({
            type: 'SET_SORT',
            payload: {
                sortBy,
                sortOrder: sortOrder as 'ASC' | 'DESC'
            }
        });
    };

    const resetFilters = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <Title level={2} style={{ margin: 0 }}>Projects</Title>
                {
                    user?.role === "client" && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/projects/create")}>
                            New Project
                        </Button>
                    )
                }
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Search projects..."
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                            value={state.filters.search || ''}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter by status"
                            style={{ width: '100%' }}
                            allowClear
                            onChange={handleStatusChange}
                            value={state.filters.status}
                        >
                            <Option value="open">Open</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Sort by"
                            style={{ width: '100%' }}
                            onChange={handleSortChange}
                            value={`${state.pagination.sortBy}_${state.pagination.sortOrder}`}
                        >
                            <Option value="postedAt_desc">Newest First</Option>
                            <Option value="postedAt_asc">Oldest First</Option>
                            <Option value="budget_desc">Budget: High to Low</Option>
                            <Option value="budget_asc">Budget: Low to High</Option>
                            <Option value="title_asc">Title: A-Z</Option>
                            <Option value="title_desc">Title: Z-A</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Space>
                            <Button
                                type="default"
                                onClick={resetFilters}
                                disabled={!Object.values(state.filters).some(Boolean)}
                            >
                                Reset Filters
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <ProjectsList
                setPage={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                setLimit={(limit) => dispatch({ type: 'SET_LIMIT', payload: limit })}
                params={{
                    ...state.pagination,
                    ...state.filters
                }}
            />
        </div>
    );
}