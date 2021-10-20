import React, { Component } from "react";
import PreRankingLanding from "./RankingLanding";
import PreRankingCriteriaView from "./RankingCriteriaView";
import PreRankingCriteriaEdit from "./RankingCriteriaEdit";

class PreRanking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 'landing',
            selectedRankingType: '',
        }
        this.updateState = this.updateState.bind(this);
    }

    updateState(state, type) {
        this.setState({ selectedRankingType: type, state: state });
    }

    render() {
        if (this.state.state === 'landing')
            return (
                <PreRankingLanding state={this.state.state} keycloak={this.props.keycloak} category={this.props.category} updateStateFunction={this.updateState} />
            );
        else if (this.state.state === 'criteria-view')
            return (
                <PreRankingCriteriaView rankingType={this.state.selectedRankingType} category={this.props.category} keycloak={this.props.keycloak} updateStateFunction={this.updateState} />
            );
        else if (this.state.state === 'criteria-edit')
            return (
                <PreRankingCriteriaEdit rankingType={this.state.selectedRankingType} category={this.props.category} keycloak={this.props.keycloak} updateStateFunction={this.updateState} />
            );


    }
}

export default PreRanking;