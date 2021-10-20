import React, { Component } from "react";
import PostRankingLanding from "./RankingLanding";
import PostRankingCriteriaView from "./RankingCriteriaView";
import PostRankingCriteriaEdit from "./RankingCriteriaEdit";

class PostRanking extends Component {
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
                <PostRankingLanding state={this.state.state} keycloak={this.props.keycloak} category={this.props.category} updateStateFunction={this.updateState} />
            );
        else if (this.state.state === 'criteria-view')
            return (
                <PostRankingCriteriaView rankingType={this.state.selectedRankingType} category={this.props.category} keycloak={this.props.keycloak} updateStateFunction={this.updateState} />
            );
        else if (this.state.state === 'criteria-edit')
            return (
                <PostRankingCriteriaEdit rankingType={this.state.selectedRankingType} category={this.props.category} keycloak={this.props.keycloak} updateStateFunction={this.updateState} />
            );
    }
}

export default PostRanking;