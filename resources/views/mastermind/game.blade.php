@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="col-sm-offset-2 col-sm-8">
            <div id="gameTable" class="panel panel-default">
                <div class="panel-heading">
                    You have <span id="remainingSteps">{{10 - count($guesses)}}</span> turns left.
                </div>

                <div class="panel-body">
                    <table class="table">
                        <tbody>
                        @foreach ($guesses as $index => $guess)
                            <tr>
                                <td class="hidden-xs">#{{$index + 1}}</td>
                                @foreach($guess as $color)
                                    <td class="table-text">
                                        <div class="btn btn-{{$color}} disabled btn-block"><span class="hidden-xs hidden-sm">{{$color}}</span> <span class="visible-xs visible-sm">{{$color[0]}}</span> </div>
                                    </td>
                                @endforeach

                                <td align="center">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <div id="eval1" class="btn btn-{{$evals[$index][0]}} disabled btn-xs btn-block">x
                                                </div>
                                            </td>
                                            <td>
                                                <div id="eval2" class="btn btn-{{$evals[$index][1]}} disabled btn-xs btn-block">x
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div id="eval3" class="btn btn-{{$evals[$index][2]}} disabled btn-xs btn-block">x
                                                </div>
                                            </td>
                                            <td>
                                                <div id="eval4" class="btn btn-{{$evals[$index][3]}} disabled btn-xs btn-block">x
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        @endforeach

                        @if(!$isGameOver)
                            <tr id="insertRow">
                                <form action="{{url('/step')}}" method="POST" class="form-horizontal">
                                    {{ csrf_field() }}
                                    <meta name="csrf-token" content="{{ csrf_token() }}" />

                                    <td class="hidden-xs" id="insertCount">
                                        #{{count($guesses) + 1}}
                                    </td>

                                    @for($i = 1; $i <= 4; $i++)
                                        <td>
                                            <select name="color{{$i}}" title="" class="selectpicker form-control">
                                                <option disabled selected value>Color...</option>
                                                @foreach($colors as $color)
                                                    <option @if (old('color'.$i) == $color) selected="selected" @endif>{{$color}}</option>
                                                @endforeach
                                            </select>
                                        </td>
                                    @endfor
                                    <td>
                                        <button id="submitButton" type="submit" class="btn btn-default">
                                            <i class="fa fa-btn fa-plus"></i>Send
                                        </button>
                                    </td>
                                </form>
                            </tr>
                        @endif
                        </tbody>
                    </table>
                    @include('common.errors')
                </div>
            </div>

            @if ($isGameOver && $isWon)
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Congratulations!
                    </div>
                    <div class="panel-body">
                            <h1>
                                You cracked the code!
                            </h1>
                            @if(\Auth::check())
                                <h2>
                                    Here's how your result compares against your own record.
                                </h2>
                                <p>
                                    You took <strong>{{count($guesses)}}</strong> steps to crack
                                    the code.
                                    @if($stats['count'] > 1)
                                        Usually, this takes <strong>{{$stats['the_stats']->average}} steps.</strong>
                                        The longest it ever took you to win was
                                        <strong>{{$stats['the_stats']->worst}}</strong>
                                        steps. Your best win took <strong>{{$stats['the_stats']->best}}</strong> steps.
                                    @endif
                                </p>
                    </div>
                </div>
            @endif
            @elseif($isGameOver && !$isWon)
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Hey, so...
                    </div>
                    <div class="panel-body">
                        <h1> nope, that's still not it. </h1>
                        <div class="row">
                            <div class="col-xs-3">
                                <p>However, your lives ran out. The correct pattern was:</p>
                            </div>
                            <div class="col-xs-5 col-sm-offset-2">
                                    <table>
                                        <tbody>
                                        <tr>
                                            @foreach($codePattern as $color)
                                            <td>
                                                <div class="btn btn-{{$color}} disabled btn-block">
                                                    {{$color}}
                                                </div>
                                            </td>
                                            @endforeach
                                        </tr>
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                    </div>
                </div>
                @endif
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{\URL::asset('js/login.js')}}"></script>
    <script src="{{\URL::asset('js/gameEvent.js')}}"></script>
    <script src="{{\URL::asset('js/gameModel.js')}}"></script>
    <script src="{{\URL::asset('js/gamePersistenceAJAX.js')}}"></script>
    <script src="{{\URL::asset('js/gameUI.js')}}"></script>
@endsection