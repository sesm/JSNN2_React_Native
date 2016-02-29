// Sample app showcasing ListView and Navigator.
// Scroll to get more cats, tap the cat to view in fullscreen
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Navigator,
    TouchableHighlight
} from 'react-native';
import _ from 'lodash';

function cats() {
    // Parsing XML with RegEx is not recommended,
    // but I wasn't able to load 'xmldom' package in RN playground
    return fetch('http://thecatapi.com/api/images/get?format=xml&results_per_page=10&size=small', {method: 'GET'})
        .then(response => response.text())
        .then(text => {
            var images = text.split("<image>");
            var urlRegex = new RegExp("<url>(.*)<\/url>");
            var idRegex = new RegExp("<id>(.*)<\/id>");
            return _.chain(images)
                .map(img => {
                    var url = img.match(urlRegex);
                    var id = img.match(idRegex);
                    if(url != null && id != null) {
                        return {
                            url: url[1],
                            id: id[1]
                        }
                    } else {
                        return null;
                    }
                })
                .filter(x => x!=null)
                .value();
        });
}

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
    }
});

AppRegistry.registerComponent('SampleApp', () => App);