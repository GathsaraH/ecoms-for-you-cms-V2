import React, {useCallback, useEffect, useState} from 'react';
import {withStyle} from 'baseui';
import {Col as Column, Grid, Row as Rows} from 'components/FlexBox/FlexBox';
import {useDrawerDispatch} from 'context/DrawerContext';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import {gql, useQuery} from '@apollo/client';
import {Header, Heading, Wrapper} from 'components/Wrapper.style';
import {StyledCell, StyledHeadCell, StyledTable, TableWrapper,} from './Category.style';
import {Plus} from 'assets/icons/Plus';
import * as icons from 'assets/icons/category-icons';
import {useDispatch, useSelector} from "react-redux";
import {getCategoryCallerAction} from '../../redux/categoryRedux/categoryActions';
import {InLineLoader} from "../../components/InlineLoader/InlineLoader";
import {AiTwotoneEdit} from "react-icons/all";

const GET_CATEGORIES = gql`
  query getCategories($type: String, $searchBy: String) {
    categories(type: $type, searchBy: $searchBy) {
      id
      icon
      name
      slug
      type
    }
  }
`;

const Col = withStyle(Column, () => ({
    '@media only screen and (max-width: 767px)': {
        marginBottom: '20px',

        ':last-child': {
            marginBottom: 0,
        },
    },
}));

const Row = withStyle(Rows, () => ({
    '@media only screen and (min-width: 768px)': {
        alignItems: 'center',
    },
}));

const categorySelectOptions = [
    {value: 'grocery', label: 'Grocery'},
    {value: 'women-cloths', label: 'Women Cloth'},
    {value: 'bags', label: 'Bags'},
    {value: 'makeup', label: 'Makeup'},
];

export default function Category() {
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState('');
    const drawerDispatch = useDrawerDispatch();
    const dispatch = useDispatch()
    const [checkedId, setCheckedId] = useState([]);
    const [checked, setChecked] = useState(false);
    const openDrawer = useCallback(
        () => drawerDispatch({type: 'OPEN_DRAWER', drawerComponent: 'CATEGORY_FORM'}),
        [drawerDispatch]
    );
    const getCateory = useSelector((state: any) => state.categoryReducer.categories);

    useEffect(() => {
        dispatch(getCategoryCallerAction())
    }, [dispatch])

    const {data, error, refetch} = useQuery(GET_CATEGORIES);
    if (error) {
        return <div>Error! {error.message}</div>;
    }


    function handleSearch(event) {
        const value = event.currentTarget.value;
        setSearch(value);
        refetch({
            type: category.length ? category[0].value : null,
            searchBy: value,
        });
    }

    function handleCategory({value}) {
        setCategory(value);
        if (value.length) {
            refetch({
                type: value[0].value,
            });
        } else {
            refetch({
                type: null,
            });
        }
    }

    function onAllCheck(event) {
        if (event.target.checked) {
            const idx = data && data.categories.map((current) => current.id);
            setCheckedId(idx);
        } else {
            setCheckedId([]);
        }
        setChecked(event.target.checked);
    }

    function handleCheckbox(event) {
        const {name} = event.currentTarget;
        if (!checkedId.includes(name)) {
            setCheckedId((prevState) => [...prevState, name]);
        } else {
            setCheckedId((prevState) => prevState.filter((id) => id !== name));
        }
    }

    const Icon = ({name}) => {
        const TagName = icons[name];
        return !!TagName ? <TagName/> : <p>Invalid icon {name}</p>;
    };


    // @ts-ignore
    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header
                        style={{
                            marginBottom: 30,
                            boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
                        }}
                    >
                        <Col md={2}>
                            <Heading>Category</Heading>
                        </Col>

                        <Col md={10}>
                            <Row>
                                <Col md={3} lg={3}>
                                    <Select
                                        options={categorySelectOptions}
                                        labelKey="label"
                                        valueKey="value"
                                        placeholder="Category Type"
                                        value={category}
                                        searchable={false}
                                        onChange={handleCategory}
                                    />
                                </Col>

                                <Col md={5} lg={6}>
                                    <Input
                                        value={search}
                                        placeholder="Ex: Search By Name"
                                        onChange={handleSearch}
                                        clearable
                                    />
                                </Col>

                                <Col md={4} lg={3}>
                                    <Button
                                        onClick={openDrawer}
                                        startEnhancer={() => <Plus/>}
                                        overrides={{
                                            BaseButton: {
                                                style: () => ({
                                                    width: '100%',
                                                    borderTopLeftRadius: '3px',
                                                    borderTopRightRadius: '3px',
                                                    borderBottomLeftRadius: '3px',
                                                    borderBottomRightRadius: '3px',
                                                }),
                                            },
                                        }}
                                    >
                                        Add Category
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Header>

                    <Wrapper style={{boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)'}}>
                        <TableWrapper>
                            <StyledTable
                                $gridTemplateColumns="minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto)">
                                <StyledHeadCell>Id</StyledHeadCell>
                                <StyledHeadCell>Icon</StyledHeadCell>
                                <StyledHeadCell>Title</StyledHeadCell>
                                <StyledHeadCell>Type</StyledHeadCell>
                                <StyledHeadCell>More Details</StyledHeadCell>

                                {getCateory ? (
                                    getCateory.length ? (
                                        getCateory
                                            .map((item, index) =>
                                                (
                                                    <React.Fragment key={index}>
                                                        <StyledCell>{item._id}</StyledCell>
                                                        <StyledCell>
                                                            <img style={{width: 60, height: 60, borderRadius: 100}}
                                                                 src={item.icon}
                                                                 alt='Ecoms For You'/>
                                                        </StyledCell>
                                                        <StyledCell>{item.title}</StyledCell>
                                                        <StyledCell>{item.type}</StyledCell>
                                                        <StyledCell><AiTwotoneEdit
                                                            style={{cursor: 'pointer'}}/></StyledCell>
                                                    </React.Fragment>
                                                )
                                            )

                                    ) : (
                                        <InLineLoader/>
                                    )
                                ) : (
                                    <InLineLoader/>
                                )}
                            </StyledTable>
                        </TableWrapper>
                    </Wrapper>
                </Col>
            </Row>
        </Grid>
    );
}
