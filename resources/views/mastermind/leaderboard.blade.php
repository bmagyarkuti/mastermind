@extends('layouts.app')

@section('content')
    <div class="container">
            <div class="col-sm-offset-2 col-sm-8">
                @if(\Auth::check() && count($myGames) > 0)
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Personal Statistics for {{$name}}
                        </div>

                        <div class="panel-body">
                            <table class="table table-striped task-table">
                                <tr>
                                    <th>Date</th>
                                    <th>Won?</th>
                                    <th>Steps</th>
                                </tr>
                                <tbody>
                                @foreach ($myGames as $game)
                                    <tr>
                                        <td class="table-text">
                                            <div>{{ $game->started}}</div>
                                        </td>
                                        <td class="table-text">
                                            <div>{{ ($game->won == null) ? "No" : "Yes" }}</div>
                                        </td>
                                        <td class="table-text">
                                            <div>{{ ($game->won == null)? "-" : $game->steps }}</div>
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>

                            <p>Usually, it takes <strong>{{$stats->average}}</strong> steps for you to win.</strong>
                                The longest it ever took you to win was <strong>{{$stats->worst}}</strong>
                                steps. Your best win took <strong>{{$stats->best}}</strong> steps.</p>
                        </div>
                    </div>
                @endif
                @if (count($entries) > 0)
                    <div class="panel panel-default">
                    <div class="panel-heading">
                        Leaderboard
                    </div>

                    <div class="panel-body">
                        @if(!\Auth::check())
                        <p class="alert-warning">
                            Your are currently browsing as guest. This means we won't be able to save your results
                            on the leaderboard. If you'd like to see your result here, <a href="{{url('auth/login')}}">
                            log in</a> before you start playing.
                        </p>
                        @endif
                        <table class="table table-striped task-table">
                            <tr>
                                <th>Name</th>
                                <th>Score</th>
                                <th>Played</th>
                                <th>Won</th>
                            </tr>
                            <tbody>
                            @foreach ($entries as $entry)
                                <tr>
                                    <td class="table-text">
                                        <div>{{ $entry->name }}</div>
                                    </td>
                                    <td class="table-text">
                                        <div>{{ $entry->score }}</div>
                                    </td>
                                    <td class="table-text">
                                        <div>{{ $entry->played }}</div>
                                    </td>
                                    <td class="table-text">
                                        <div>{{ $entry->won }}</div>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                    @else
                        <div class="panel-body">
                            <p class="alert-info">
                                Nobody has played just yet :(
                            </p>
                        </div>
                    @endif
                </div>
            </div>
    </div>
@endsection