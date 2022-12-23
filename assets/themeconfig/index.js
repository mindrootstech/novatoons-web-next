export const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: '#fff',
        background: '#000',
        padding: 20,
    }),
    control: (styles) => ({ ...styles, backgroundColor: 'transparent', padding: 5 }),
    valueContainer: () => ({
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap'
    }),
    menuList: () => ({
        background: '#000',
        zIndex: 9999,
        fontSize: 16
    }),
    placeholder: () => ({
        paddingLeft: 15,
        fontSize: 14,
        fontWeight: 600,
        // fontFamily: 'Urbanist'
    }),
    multiValueLabel: () => ({
        color: '#fff',
        padding: 8,
        fontSize: 14,
        fontWeight: 600,
        // fontFamily: 'Urbanist',
        display: 'inline-block'
    }),
    multiValueRemove: () => ({
        color: '#fff',
        padding: 8,
        fontSize: 14,
        fontWeight: 600,
        // fontFamily: 'Urbanist',
        display: 'inline-block',
        
    }),
    multiValue: () => ({
        background: '#353444',
        borderRadius: 50,
        marginRight: 8,
        color: '#fff',
        display:'inline-flex',
        marginBottom: '4px'
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition, color: '#fff', padding: 8, fontSize: 16, fontWeight: 600,};
    },
    menuList: (provided, state) => ({
        ...provided,
        // height:220,
        overflowY: 'scroll',
        backgroundColor: '#000',
        fontSize: 16,
        fontFamily: 'Urbanist'
    }),
    input:(provided, state) => ({
        color:'#fff',
        fontSize: 16,
    }),
    indicatorsContainer: (provided, state) => ({
        display: 'none'
    })
}
