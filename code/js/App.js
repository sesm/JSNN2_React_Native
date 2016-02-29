'use strict';
import React, {
    Component,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Navigator,
    TouchableHighlight
} from 'react-native';
import cats from './Cats';
import _ from 'lodash';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

var Overview = React.createClass({
    _fetchData: function () {
        cats().then(result=> {
            var newData = this.state.data.concat(result);
            this.setState({
                data: newData,
                loading: false,
                dataSource: ds.cloneWithRows(newData)
            })
        })
    },
    getInitialState: function () {
        return {
            data: [],
            loading: true
        }
    },
    componentDidMount: function () {
        this._fetchData()
    },
    render: function () {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text style={styles.welcome}>
                        Loading...
                    </Text>
                </View>)
        } else {
            return (
                <View style={styles.container}>
                    <ListView
                        onEndReached={()=>this._fetchData()}
                        onEndReachedThreshold={600}
                        dataSource={this.state.dataSource}
                        renderRow={(pic) =>
                            <TouchableHighlight
                                onPress={()=>this.props.navigator.push({id: 2, url: pic.url})}>
                                <Image
                                    key={pic.id}
                                    style={{height: 200}}
                                    source={{uri: pic.url}}/>
                            </TouchableHighlight>
                        }
                    />
                </View>
            );
        }
    }
});

var ImageView = React.createClass({
    render: function () {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={{flex: 1}}
                    onPress={()=>this.props.navigator.pop()}>
                    <Image
                        style={{flex: 1}}
                        source={{uri: this.props.url}}/>
                </TouchableHighlight>
            </View>)
    }
});

var App = React.createClass({
    _renderScene: function (route, navigator) {
        if (route.id == 1) {
            return <Overview navigator={navigator}/>
        } else if (route.id == 2) {
            return <ImageView navigator={navigator} url={route.url}/>
        }
    },
    render: function () {
        return <Navigator
            initialRoute={{id: 1}}
            renderScene={this._renderScene}
        />
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

module.exports = App;
