import styled from '@emotion/styled'

export const Timeline = styled.section`
    display: flex;
    /* display: block; */
    width: 100%;
    height: 60px;
    position: relative;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: white;
    overflow: hidden;
    align-items: center;
    justify-content: space-around;
    /* padding: 0 1%; */
    padding: 0;
    box-sizing: border-box;
`;

export const PlaybarContainer = styled.div`
    display: block;
    position: relative;
    /* top: calc(50% - 5px); */
    /*   left: 10px; */
    flex: 0 0 calc(100% - 40px);
    width: calc(100% - 40px);
    height: 10px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.01);
    /*   box-shadow: inset 1px 1px 2px rgba(0,0,0,.4); */
    /*   overflow: hidden; */
    border-radius: 20px;
    cursor: pointer;
`;

export const Playbar = styled.div`
    position: relative;
    left: 0;
    height: 100%;
    background: rgba(0, 180, 240, 0.7);
    box-shadow: inset 0px 0px 1px rgba(0, 0, 0, 0.9);
    border-radius: 20px 0 0 20px;
    width: 0%;
    &.notSliding{
        /* transition: width 0.16s linear; */
        transition: width 0.16s linear, background 1s linear;
    }
    &.notSliding:hover{
        background: rgba(0, 180, 240, 1);
    }
`;

export const Handle = styled.div`
    position: absolute;
    left: 0px;
    top: -3px;
    display: block;
    border-radius: 50%;
    height: 15px;
    width: 15px;
    border: 1px solid rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.8);
`;
